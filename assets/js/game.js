import { setupMap, addMarker } from './map.js';
import { startTimer, stopTimer, clearTimer } from './timer.js';

let round = 1;
let score = 0;
let scoreTotal = 0;
let actual_location = null;
let target_location = null;
let previousMarker = null;
let isValidationClicked = false;
let map;
let validCoordinates = [];

async function loadValidCoordinates() {
  try {
    const response = await fetch('assets/data/europe_valid_coordinates.json');
    validCoordinates = await response.json();
    console.log('Coordonnées valides chargées :', validCoordinates.length);
  } catch (error) {
    console.error('Erreur lors du chargement des coordonnées :', error);
  }
}

function getRandomValidCoordinate() {
  const randomIndex = Math.floor(Math.random() * validCoordinates.length);
  return validCoordinates[randomIndex];
}

export async function startRound() {
  isValidationClicked = false;
  console.log('Starting round', round + 1);
  clearTimer();

  document.getElementById("map").style.display = "none";
  document.getElementById("pano").style.display = "none";
  document.getElementById("loader").style.display = "block"; 

  if (validCoordinates.length === 0) {
    await loadValidCoordinates();
  }

  if (round < 6) {
    let randomCoords = getRandomValidCoordinate(); 
    console.log('Selected random valid coordinates:', randomCoords);

    const result = setupMap(randomCoords, 'move');
    map = result.map;
    target_location = randomCoords;

    document.getElementById("loader").style.display = "none";
    document.getElementById("map").style.display = "block";
    document.getElementById("pano").style.display = "block";

    startTimer();
    console.log('Map and panorama setup, target location:', target_location);

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
    endGame();
  }
}

export function validateGuess() {
  console.log('Validating guess');
  stopTimer();

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
    document.getElementById("dist").innerHTML = `${km_distance.toFixed(2)} km`;
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
    round++;

    console.log('Validation clicked, round completed');
  } else {
    console.log('No marker placed, cannot validate');
  }

  document.getElementById("popup").style.display = "block";
}

export function endGame() {
  const endpopup = document.getElementById("endpopup");
  endpopup.style.display = "block";
  document.getElementById("endscore").innerHTML = `${scoreTotal.toFixed(3)} points.`;

  fetch('/assets/php/validate_score.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      score: scoreTotal
    })
  })
  .then(response => response.text())
  .then(data => {
    console.log('Score sent successfully:', data);
  })
  .catch(error => {
    console.error('Error sending score:', error);
  });
}
