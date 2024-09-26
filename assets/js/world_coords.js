const googleMapsClient = new google.maps.StreetViewService();
const MAX_ATTEMPTS = 5000; 
let validCoordinates = [];

const LAT_MIN_EUROPE = -56.0;
const LAT_MAX_EUROPE = 13.5;
const LNG_MIN_EUROPE = -81.5;
const LNG_MAX_EUROPE = -34.8;

// // Limites géographiques pour le Japon
// const LAT_MIN_JAPAN = 24.3;  // Sud du Japon (îles Ryukyu)
// const LAT_MAX_JAPAN = 45.5;  // Nord du Japon (Hokkaido)
// const LNG_MIN_JAPAN = 122.9;  // Ouest du Japon (proche de Taïwan)
// const LNG_MAX_JAPAN = 153.9;  // Est du Japon (océan Pacifique)


// // Limites géographiques pour l'Amérique du Sud
// const LAT_MIN_SOUTH_AMERICA = -56.0;  // Sud de l'Argentine (Terre de Feu)
// const LAT_MAX_SOUTH_AMERICA = 13.5;   // Nord de la Colombie et Venezuela
// const LNG_MIN_SOUTH_AMERICA = -81.5;  // Ouest du Pérou (côte Pacifique)
// const LNG_MAX_SOUTH_AMERICA = -34.8;  // Est du Brésil (côte Atlantique)

// const LAT_MIN_EUROPE = 36.0;
// const LAT_MAX_EUROPE = 71.0;
// const LNG_MIN_EUROPE = -25.0;
// const LNG_MAX_EUROPE = 45.0;

// // Limites géographiques pour la Russie
// const LAT_MIN_RUSSIA = 41.2;  // Sud de la Russie, près de la frontière avec la Géorgie
// const LAT_MAX_RUSSIA = 81.9;  // Nord de la Russie, îles arctiques
// const LNG_MIN_RUSSIA = 19.6;  // Ouest de la Russie, près de la frontière avec la Finlande et la Norvège
// const LNG_MAX_RUSSIA = 179.9;  // Extrême Est de la Russie, près du détroit de Béring


// const LAT_MIN_NORTH_AMERICA = 14.5;  // Sud du Mexique
// const LAT_MAX_NORTH_AMERICA = 83.1;  // Nord du Canada (Nunavut)
// const LNG_MIN_NORTH_AMERICA = -168.5;  // Ouest de l'Alaska
// const LNG_MAX_NORTH_AMERICA = -52.6;  // Est de Terre-Neuve, Canada

function generateRandomCoordsEurope() {
    const lat = Math.random() * (LAT_MAX_EUROPE - LAT_MIN_EUROPE) + LAT_MIN_EUROPE;
    const lng = Math.random() * (LNG_MAX_EUROPE - LNG_MIN_EUROPE) + LNG_MIN_EUROPE;
    return { lat, lng };
}

function checkStreetView(coords, radius, callback) {
    googleMapsClient.getPanorama({ location: coords, radius: radius }, (data, status) => {
        if (status === google.maps.StreetViewStatus.OK) {
            callback(true, coords);
        } else {
            callback(false, coords);
        }
    });
}

function isCoordinateAlreadyInList(coords, list) {
    return list.some(c => c.lat === coords.lat && c.lng === coords.lng);
}

async function loadExistingCoordinates() {
    try {
        const response = await fetch('assets/data/europe_valid_coordinates.json');  
        const data = await response.json();
        validCoordinates = data;  
        console.log('Coordonnées existantes chargées :', validCoordinates.length);
    } catch (error) {
        console.log('Aucune coordonnées existante trouvée. Un nouveau fichier sera créé.');
    }
}

function collectValidCoordinatesEurope() {
    let attempts = 0;
    let radius = 50;

    function attemptNext() {
        if (attempts >= MAX_ATTEMPTS) {
            console.log("Terminé. Coordonnées valides collectées : ", validCoordinates);
            displayCoordinates(validCoordinates);
            saveCoordinates(validCoordinates);  
            return;
        }

        const randomCoords = generateRandomCoordsEurope();

        
        if (isCoordinateAlreadyInList(randomCoords, validCoordinates)) {
            console.log('Coordonnée déjà présente, on cherche une autre coordonnée.');
            attemptNext(); 
            return;
        }

        checkStreetView(randomCoords, radius, (isValid, coords) => {
            if (isValid) {
                console.log('Coordonnée valide trouvée : ', coords);
                validCoordinates.push(coords); 
            } else {
                console.log('Pas de panorama à ces coordonnées');
            }
            attempts++;
            attemptNext();  
        });
    }

    attemptNext();
}

function displayCoordinates(coordinates) {
    const output = document.getElementById("output");
    output.textContent = JSON.stringify(coordinates, null, 2);
}

function saveCoordinates(coordinates) {
    const json = JSON.stringify(coordinates, null, 2); 
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "europe_valid_coordinates.json";
    a.click();
}

async function startCollectionEurope() {
    console.log("Début de la collecte des coordonnées valides pour l'Europe");
    await loadExistingCoordinates(); 
    collectValidCoordinatesEurope(); 
}
