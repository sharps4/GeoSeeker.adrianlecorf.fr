const labels = "";
let labelIndex = 0;
let previousMarker;
let actual_location = null;
let target_location = null;
let map;
let round = 0;
let score = 0;
let scoreTotal = 0;
let locations = [];


async function fetchLocations() {
    try {
      const response = await fetch('locations.json');
      const data = await response.json();
      locations = data;
      console.log(locations);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  }
let pano = document.getElementById("pano")
let minimap = document.getElementById("map")

const loader = document.getElementById("loader");

var popup = document.getElementById("popup");
var endpopup = document.getElementById("endpopup");
var timepopup = document.getElementById("timepopup");

function generateRandomCoords() {
    // console.log(locations.length);
    if (locations.length === 0) {
      throw new Error("No more locations available");
    }
    const index = Math.floor(Math.random() * locations.length);
    const location = locations[index];
    locations.splice(index, 1); // remove the selected location from the array
    return new google.maps.LatLng(location[0], location[1]);
  }

async function initialize() {
    await fetchLocations();
    generateAndSetupMap();
  }

function generateAndSetupMap() {
    endpopup.style.display = "none";
    timepopup.style.display = "none";
    let randomCoords = generateRandomCoords();
    setupMap(randomCoords);
    target_location = randomCoords;
    loader.style.display = "none";
}

function setupMap(location) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39, lng: 34 },
    streetViewControl: false,
    zoom: 0,
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
      }
    }
  );

  google.maps.event.addListener(map, "click", (event) => {
    addMarker(event.latLng, map);
  });
  clearTimer();
}

function addMarker(location, mapRef) {
  actual_location = location;
  if (previousMarker) {
    previousMarker.setMap(null);
  }

  previousMarker = new google.maps.Marker({
    position: location,
    map: mapRef,
  });
}


const validateButton = document.getElementById("validate");
const validate2 = document.getElementById("validate2");

function startRound() {
    clearTimer();
    if (round <= 5) {
      endpopup.style.display = "none";
      timepopup.style.display = "none";
      validateButton.dataset.clicked = "false";
      let randomCoords = generateRandomCoords();
      setupMap(randomCoords);
      target_location = randomCoords;
      pano.style.display = "block";
      minimap.style.display = "block";
      loader.style.display = "none";
    } else {
      endpopup.style.display = "block";
      timepopup.style.display = "none";
      document.getElementById("endscore").innerHTML = `${scoreTotal.toFixed(3)} points.`;
      $.ajax({
        url: "/assets/php/validate_score.php",
        method: "POST",
        data: { score: scoreTotal },
        success: function(response) {
          console.log(response);
        },
        error: function(xhr, status, error) {
          console.log("Erreur : " + error);
        }
      });
      document.getElementById("score").innerHTML = `0`;
      document.getElementById("round").innerHTML = `0`;
    }
  }

validate2.style.display = "none";

validate2.addEventListener("click", () => {
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
});

validateButton.addEventListener("click", () => {
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
});

var timeLeft = 5 * 60; // 5 minutes en secondes
var timerInterval;  

function startTimer() {
  timerInterval = setInterval(function() {
    timeLeft--;
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer").innerHTML = minutes + ":" + seconds ;

    if (timeLeft === 0) {
      timepopup.style.display = "block";
      clearInterval(timerInterval);
    }
  }, 1000);
}

function clearTimer() {
  clearInterval(timerInterval);
  timeLeft = 5 * 60;
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