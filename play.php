<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--CSS-->
    <link rel="stylesheet" href="assets/css/styles.css"> 
    <!--Polyfill-->
    <!-- <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>-->
    <!--Fontawesome-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
    <!--Fonts-->
    <link rel="stylesheet" href="https://use.typekit.net/mfh2zpo.css">
    <!--JS-->
    <script>
        var map2 = "<?php echo isset($_GET['maps2']) ? $_GET['maps2'] : 'default'; ?>";
        var timer = "<?php echo isset($_GET['timer']) ? $_GET['timer'] : ''; ?>";
        var move = "<?php echo isset($_GET['move']) ? $_GET['move'] : ''; ?>";
    </script>

    <title>GeoSeeker</title>
</head>

<body>
    <!-- <head>
        <div class="top-container">
            <nav class="nav-items">
                <ul>
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="play.html">Jouer</a></li>
                    <li>A propos</li>
                </ul>
            </nav>
        </div>
    </head> -->

    <!--Loader-->
    <div id="loader">
        <span class="span"><i class="fa-solid fa-location-dot"></i></span>
        <span class="span" style="--delay: 0.1s"><i class="fa-solid fa-location-dot"></i></span>
        <span class="span" style="--delay: 0.2s"><i class="fa-solid fa-location-dot"></i></span>
        <span class="span" style="--delay: 0.3s"><i class="fa-solid fa-location-dot"></i></span>
        <span class="span" style="--delay: 0.4s"><i class="fa-solid fa-location-dot"></i></span>
    </div>   
    <!--Game infos-->  
    <div class="infos2 round">Manche <span id="round">1</span></div>
    <div class="infos">
        <div class="score2">Score total : </span><span id="scoreTotal"></span></div>
        <div class="timer"><i class="fa-regular fa-clock"></i> Temps restant : <span id="timer"></span></div>
    </div> 
    <!--Maps-->
    <div id="map"></div>
    <div id="pano"></div>

    <div class="validate">
        <a class="valid-btn" id="validate">Valider mon guess</a>
    </div>

    <!--Popup-->
    <div id="popup" class="popup">
        <div class="popup-content">
            <div class="popup-header">
              <h2>Manche terminé !</h2>
            </div>
            <div class="popup-body">
                <p>Tu as placé ton guess à <span id="dist"></span> de la bonne postion et tu as fait un score de <span id="score2"></span> sur cette manche.</p>
            </div>
            <div class="popup-footer">
                <a class="valid-btn" id="next">Passer à la manche suivante</a>
                <a class="valid-btn" href="index.php" style="text-decoration:none">Retour à l'accueil</a>
            </div>
          </div>
      </div>

      <div id="endpopup" class="endpopup">
        <div class="popup-content">
            <div class="popup-header">
              <h2>Le jeu est terminé !</h2>
            </div>
            <div class="popup-body">
                <p>Tu as placé ton dernier guess à <span id="dist2"></span> de la bonne postion et tu as fait un score de <span id="score3"></span> sur cette manche.</p>
                <p>Ton score final est de <span id="endscore"></span></p>
            </div>
            <div class="popup-footer">
                <a class="valid-btn" id="next3">Rejouer</a>
                <a class="valid-btn" href="index.php" style="text-decoration:none">Retour à l'accueil</a>
            </div>
          </div>
      </div>

      <div id="timepopup" class="timepopup">
        <div class="popup-content">
            <div class="popup-header">
              <h2>Temps écoulé !</h2>
            </div>
            <div class="popup-body">
                <p>La manche est terminé ! Tu ne gagnes pas de points sur cette manche.</p>
            </div>
            <div class="popup-footer">
                <a class="valid-btn" id="next2">Passer à la manche suivante</a>
                <a class="valid-btn" href="index.php" style="text-decoration:none">Retour à l'accueil</a>
            </div>
          </div>
      </div>

    <a class="valid-btn2" id="validate2">Valider</a>

    <script type="module" src="assets/js/utils.js"></script>
    <script type="module" src="assets/js/map.js"></script>
    <script type="module" src="assets/js/timer.js"></script>
    <script type="module" src="assets/js/game.js"></script>
    <script type="module" src="assets/js/events.js"></script>
    <script type="module" src="assets/js/main.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</body>
</html> 
