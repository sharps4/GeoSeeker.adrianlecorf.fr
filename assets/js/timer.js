let timeLeft = timer;
let timerInterval;

export function startTimer() {
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

export function stopTimer() {
  clearInterval(timerInterval);
}

function getTimerFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('timer');
}

export function clearTimer() {
  clearInterval(timerInterval);
  timeLeft = getTimerFromUrl(); 
}