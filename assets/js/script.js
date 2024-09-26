const labels = "";
let labelIndex = 0;
let previousMarker;
let actual_location = null;
let target_location = null;
let map;
let round = 0;
let score = 0;
let scoreTotal = 0;
let isValidationClicked = false;


let pano = document.getElementById("pano")
let minimap = document.getElementById("map")

const loader = document.getElementById("loader");

var popup = document.getElementById("popup");
var endpopup = document.getElementById("endpopup");
var timepopup = document.getElementById("timepopup");

function generateRandomCoords() {
  console.log(map2);
  if (map2 === 'france') {
      return generateRandomCoordsFrance();
  } 
  if (map2 === 'romania') {
    return generateRandomCoordsRomania();
  } else {
      let lat = Math.random() * (90 - -90) + -90;
      let lng = Math.random() * (180 - -180) + -180;
      let location = new google.maps.LatLng(lat, lng);
      
      return location;
  }
}

function generateRandomCoordsFrance() {
  let lat = Math.random() * (51.124 - 41.303) + 41.303;
  let lng = Math.random() * (9.662 - -5.266) + -5.266;
  let location = new google.maps.LatLng(lat, lng);
  
  return location;
}

function generateRandomCoordsRomania() {
  let lat = Math.random() * (48.2654 - 43.6187) + 43.6187;
  let lng = Math.random() * (29.6340 - 20.2202) + 20.2202;
  let location = new google.maps.LatLng(lat, lng);
  
  return location;
}

function initialize() {
  generateAndSetupMap();
}

function generateAndSetupMap() {
  endpopup.style.display = "none";
  timepopup.style.display = "none";
  let randomCoords = generateRandomCoords();
  const streetViewService = new google.maps.StreetViewService();
  streetViewService.getPanorama({location: randomCoords, radius: 50}, (data, status) => {
    if (status === google.maps.StreetViewStatus.OK) {
      setupMap(randomCoords);
      target_location = randomCoords
      loader.style.display = "none";
    } else {
      generateAndSetupMap();
    }
  });
}

function setupMap(location) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39, lng: 34 },
    streetViewControl: false,
    zoom: 2.5,
  });  
  validate2.style.display = "block";
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(validate2);

  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: location,
      pov: {
        heading: 34,
        pitch: 10,
        zoom: 0,
      },
      zoomControl: false,
      addressControl: false,
      showRoadLabels: false,
      panControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT,
      },
      disableDefaultUI: move === 'no' ? true : false,
      clickToGo: move === 'no' ? false : true,
    }
  );

  google.maps.event.addListener(map, "click", (event) => {
    addMarker(event.latLng, map);
  });
  clearTimer();
}

function addMarker(location, mapRef) {
  if (isValidationClicked) {
    return;
  }
  actual_location = location;
  if (previousMarker) {
    previousMarker.setMap(null);
  }

  previousMarker = new google.maps.Marker({
    position: location,
    map: mapRef,
    icon: {
      url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      scaledSize: new google.maps.Size(40, 40)
    }
  });
}


const validateButton = document.getElementById("validate");
const validate2 = document.getElementById("validate2");

function startRound() {
  isValidationClicked = false;
  clearTimer();
  if (round <= 5) {
    endpopup.style.display = "none";
    timepopup.style.display = "none";
    validateButton.dataset.clicked = "false";
    let randomCoords = generateRandomCoords();
    const streetViewService = new google.maps.StreetViewService();
    streetViewService.getPanorama({location: randomCoords, radius: 50}, (data, status) => {
      if (status === google.maps.StreetViewStatus.OK) {
        setupMap(randomCoords);
        target_location = randomCoords;
        pano.style.display = "block";
        minimap.style.display = "block";
        loader.style.display = "none";
      } else {
        startRound();
        score = 0;
      }
    });
  } else {
    endpopup.style.display = "block";
    timepopup.style.display = "none";
    document.getElementById("endscore").innerHTML = `${scoreTotal.toFixed(3)} points.`;
    $.ajax({
      url: "/assets/php/validate_score.php",
      method: "POST",
      data: { score: scoreTotal },
      success: function(response) {
        // Traitement de la réponse de votre script PHP
        console.log(response);
      },
      error: function(xhr, status, error) {
        // Gestion des erreurs de la requête AJAX
        console.log("Erreur : " + error);
      }
    });
    document.getElementById("score").innerHTML = `0`;
    document.getElementById("round").innerHTML = `0`;
  }
}

validate2.style.display = "none";

validate2.addEventListener("click", () => {
  stopTimer();
  if (isValidationClicked) {
    return;
  }
  validateButton.dataset.clicked = "true";
  if (actual_location) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(actual_location, target_location);
    const km_distance = distance / 1000;
    const max_score = 5000;
    console.log(`La distance entre les deux points est de ${distance} mètres.`);
    
    score = max_score*(1-Math.sqrt(Math.sqrt(km_distance/22000)));
    console.log(km_distance, km_distance/22000, Math.sqrt(Math.sqrt(km_distance/22000)))
    scoreTotal += score;

    if (score < 0) {
      score = 0;
    }

    if (score > 5000) {
      score = 5000;
    }

    if (scoreTotal > 250000) {
      scoreTotal = 250000;
    }
    
    console.log(`Votre score pour la manche ${round} est de ${score} points.`);
    
    const line = new google.maps.Polyline({
      path: [actual_location,target_location],
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
        scaledSize: new google.maps.Size(40, 40) 
      } 
    });

    round++;

    document.getElementById("score").innerHTML = `${score.toFixed(3)} points`;
    document.getElementById("round").innerHTML = `${round}`;
    document.getElementById("dist").innerHTML = `${km_distance.toFixed(2)} km`;
    document.getElementById("score2").innerHTML = `${score.toFixed(3)} points`;
    document.getElementById("dist2").innerHTML = `${km_distance.toFixed(2)} km`;
    document.getElementById("score3").innerHTML = `${score.toFixed(3)} points`;

    // if (round == 5) {
    //   const xhr = new XMLHttpRequest();
    //   xhr.open("POST", "https://geoseeker.adrianlecorf.fr/assets/php/validate_score.php", true);
    //   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    //   xhr.send("score=" + scoreTotal);
    // } 
  }
  popup.style.display = "block";
  isValidationClicked = true;
});

validateButton.addEventListener("click", () => {
  stopTimer();
  if (isValidationClicked) {
    return;
  }
  validateButton.dataset.clicked = "true";
  if (actual_location) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(actual_location, target_location);
    const km_distance = distance / 1000;
    const max_score = 5000;
    console.log(`La distance entre les deux points est de ${distance} mètres.`);
    
    score = max_score*(1-Math.sqrt(Math.sqrt(km_distance/22000)));
    console.log(km_distance, km_distance/22000, Math.sqrt(Math.sqrt(km_distance/22000)))
    scoreTotal += score;

    if (score < 0) {
      score = 0;
    }

    if (score > 5000) {
      score = 5000;
    }

    if (scoreTotal > 250000) {
      scoreTotal = 250000;
    }
    
    console.log(`Votre score pour la manche ${round} est de ${score} points.`);
    
    const line = new google.maps.Polyline({
      path: [actual_location,target_location],
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: map,
    });

    new google.maps.Marker({
      position: target_location,
      map: map,
    });

    round++;

    document.getElementById("score").innerHTML = `${score.toFixed(3)} points`;
    document.getElementById("round").innerHTML = `${round}`;
    document.getElementById("dist").innerHTML = `${km_distance.toFixed(2)} km`;
    document.getElementById("score2").innerHTML = `${score.toFixed(3)} points`;

    // if (round == 5) {
    //   const xhr = new XMLHttpRequest();
    //   xhr.open("POST", "https://geoseeker.adrianlecorf.fr/assets/php/validate_score.php", true);
    //   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    //   xhr.send("score=" + scoreTotal);
    // } 
  }
  popup.style.display = "block";
  isValidationClicked = true;
});

// var timeLeft = 5 * 60; // 5 minutes en secondes
var timeLeft = timer; 
var timerInterval;  

function startTimer() {
  timerInterval = setInterval(function() {
    timeLeft--;
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;

    if (timeLeft >= 60) {
      document.getElementById("timer").innerHTML = minutes + "m";
    } else {
      document.getElementById("timer").innerHTML = minutes + ":" + seconds;
    }

    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer").innerHTML = minutes + ":" + seconds ;

    if (timeLeft === 0) {
      timepopup.style.display = "block";
      clearInterval(timerInterval);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function getTimerFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('timer');
}

function clearTimer() {
  clearInterval(timerInterval);
  timeLeft = getTimerFromUrl(); 
  startTimer();
}

let next = document.getElementById("next");
next.addEventListener("click", () => {
  popup.style.display = "none";
  if (validateButton.dataset.clicked === "true") {
    // validateButton.style.display = "none";
    pano.style.display = "none";
    minimap.style.display = "none";
    loader.style.display = "flex";  
    console.log("chargement")
    startRound();
  } else {  
    alert(`Tu dois valider ton guess avant de pouvoir passer à la prochaine manche !`);
    console.log("Valider non cliqué")
  }
}) 

let next2 = document.getElementById("next2");
next2.addEventListener("click", () => {
  popup.style.display = "none";
    // validateButton.style.display = "none";
    pano.style.display = "none";
    minimap.style.display = "none";
    loader.style.display = "flex";  
    console.log("chargement")
    startRound();
}) 

let next3 = document.getElementById("next3");
next3.addEventListener("click", () => {
  window.location.reload();
}) 

window.initialize = initialize;