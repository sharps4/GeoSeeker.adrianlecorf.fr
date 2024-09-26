import { startRound, validateGuess, roomId } from './multi.js'; 

const socket = io('http://localhost:3000'); 

const validateButton = document.getElementById("submitGuess");
const validateButton2 = document.getElementById("validate2");
const next = document.getElementById("next");
const next2 = document.getElementById("next2");
const next3 = document.getElementById("next3");

const pano = document.getElementById("pano");
const minimap = document.getElementById("map");
const loader = document.getElementById("loader");
var popup = document.getElementById("popup");

validateButton.addEventListener("click", validateGuess);
validateButton2.addEventListener("click", validateGuess);

next.addEventListener("click", () => {
    socket.emit('nextRound', { roomId });
    console.log("Next round button clicked, emitting nextRound event");
});

next2.addEventListener("click", () => {
    socket.emit('nextRound', { roomId });
    console.log("Next round button clicked, emitting nextRound event");
});

next3.addEventListener("click", () => {
    window.location.reload();
});
