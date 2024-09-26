import { startRound, validateGuess } from './game.js';

const validateButton = document.getElementById("validate");
const validateButton2 = document.getElementById("validate2");
const next= document.getElementById("next");
const next2 = document.getElementById("next2");
const next3 = document.getElementById("next3");

const pano = document.getElementById("pano")
const minimap = document.getElementById("map")
const loader = document.getElementById("loader");
var popup = document.getElementById("popup");

validateButton.addEventListener("click", validateGuess);
validateButton2.addEventListener("click", validateGuess);


next.addEventListener("click", () => {
    popup.style.display = "none";
    pano.style.display = "none";
    minimap.style.display = "none";
    loader.style.display = "flex";  
    console.log("chargement")
    startRound();
    }) 
  
  next2.addEventListener("click", () => {
    popup.style.display = "none";
      pano.style.display = "none";
      minimap.style.display = "none";
      loader.style.display = "flex";  
      console.log("chargement")
      startRound();
  }) 
  
  next3.addEventListener("click", () => {
    window.location.reload();
  }) 