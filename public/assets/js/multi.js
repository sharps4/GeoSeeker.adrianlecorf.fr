import { setupMap, addMarker } from './map.js';

const socket = io('https://geoseeker.adrianlecorf.fr', {
  transports: ['websocket', 'polling']
});
export let roomId = null;
let isReady = false;

let round = 0;
let score = 0;
let scoreTotal = 0;
let actual_location = null;
let target_location = null;
let previousMarker = null;
let isValidationClicked = false;
let map;
let countdown; 
let isPopupClosed = false; 
let isMapSetup = false;

document.getElementById('createRoom').addEventListener('click', () => {
  socket.emit('createRoom');
});

document.getElementById('joinRoom').addEventListener('click', () => {
  roomId = document.getElementById('roomIdInput').value;
  socket.emit('joinRoom', roomId);
});

socket.on('roomCreated', ({ roomId: id }) => {
  roomId = id;
  document.getElementById('roomIdInput').value = roomId;
  document.getElementById('roomStatus').style.display = 'block';
  document.getElementById('roomStatus').textContent = `Salon créé avec l'ID : ${roomId}, en attente de joueurs...`;
});

socket.on('waitingForPlayer', () => {
  document.getElementById('roomStatus').textContent = `Joueur rejoint ! En attente de l'autre joueur...`;
});

socket.on('startGameCountdown', () => {
  document.getElementById('readyStatus').style.display = 'block';
  document.getElementById('roomStatus').style.display = 'none';
  setTimeout(() => {
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('readyStatus').style.display = 'none';
    socket.emit('startRound', roomId);
  }, 5000);
});

socket.on('startRound', ({ randomCoords }) => {
  if (randomCoords && randomCoords.lat && randomCoords.lng) {
      console.log('Coordonnées reçues pour le round:', randomCoords); 
      startRound(randomCoords);
  } else {
      console.error('Erreur : Coordonnées invalides ou undefined reçues du serveur.');
  }
});

export async function startRound(randomCoords) {
  if (randomCoords && randomCoords.lat && randomCoords.lng) {
    isValidationClicked = false;
    console.log('Starting round with coordinates:', randomCoords);

    clearInterval(countdown);
    document.getElementById('timer').style.display = 'none';

    document.getElementById("map").style.display = "none";
    document.getElementById("pano").style.display = "none";
    document.getElementById("loader").style.display = "block";

    target_location = randomCoords; 
    const result = setupMap(randomCoords);
    map = result.map;

    document.getElementById("loader").style.display = "none";
    document.getElementById("map").style.display = "block";
    document.getElementById("pano").style.display = "block";

    console.log('Map and panorama setup at:', target_location);

    google.maps.event.addListener(map, 'click', (event) => {
      if (!isValidationClicked) {
        previousMarker = addMarker(event.latLng, map, previousMarker);
        actual_location = event.latLng;
        console.log('Marker placed at:', actual_location);
      } else {
        console.log('Validation already clicked, no more markers allowed');
      }
    });
  } else {
    console.error('Erreur : Coordonnées invalides ou undefined.');
  }
}

export function validateGuess() {
  console.log('Validating guess');

  if (isValidationClicked) {
    console.log('Guess already validated');
    return;
  }

  if (actual_location) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(actual_location, target_location);
    const km_distance = distance / 1000;
    const max_score = 5000;

    score = max_score * (1 - Math.sqrt(Math.sqrt(km_distance / 22000)));
    scoreTotal += score > 0 ? score : 0;

    if (score > 5000) score = 5000;
    if (scoreTotal > 250000) scoreTotal = 250000;

    console.log('Distance between guess and target:', km_distance, 'km');
    console.log('Score for this round:', score);
    console.log('Total score:', scoreTotal);

    document.getElementById("scoreTotal").innerHTML = `${scoreTotal.toFixed(3)} points`;
    document.getElementById("round").innerHTML = `${round + 1}`;
    document.getElementById("dist2").innerHTML = `${km_distance.toFixed(2)} km`;
    document.getElementById("score2").innerHTML = `${score.toFixed(3)} points`;
    document.getElementById("dist2").innerHTML = `${km_distance.toFixed(2)} km`;
    document.getElementById("score3").innerHTML = `${score.toFixed(3)} points`;

    const line = new google.maps.Polyline({
      path: [actual_location, target_location],
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: map,
    });

    new google.maps.Marker({
      position: target_location,
      map: map,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(40, 40),
      }
    });

    isValidationClicked = true;

    socket.emit('submitGuess', { roomId, guess: actual_location });

    startTimer(15);
  } else {
    console.log('No marker placed, cannot validate');
  }
}


socket.on('startTimer', ({ seconds }) => {
  startTimer(seconds);  
});

function startTimer(seconds) {
  let timeLeft = seconds;
  document.getElementById('timer').style.display = 'block';
  if (countdown) { clearInterval(countdown); } 
  countdown = setInterval(() => {
      if (timeLeft <= 0) {
          clearInterval(countdown);
          // socket.emit('timeUp', { roomId });  // Notify server when time is up
          document.getElementById("popup").style.display = "block";  
      } else {
          document.getElementById('timer').textContent = `Temps restant : ${timeLeft} secondes`;
          timeLeft--;
      }
  }, 1000);
}

socket.on('showResults', (guesses) => {
  clearInterval(countdown);  
  document.getElementById('timer').style.display = 'none';
  document.getElementById('timer').textContent = '';
  
  document.getElementById('popup').style.display = 'block';
  document.getElementById('dist2').textContent = `Guesses: ${JSON.stringify(guesses)}`;
  document.getElementById('next').style.display = 'block';
  
  isPopupClosed = false;  
});

socket.on('startNextRound', ({ randomCoords, round }) => {
  document.getElementById('popup').style.display = 'none';  
  isPopupClosed = false;  

  startRound(randomCoords);
});