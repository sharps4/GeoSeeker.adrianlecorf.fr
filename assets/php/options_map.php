<!DOCTYPE html>
<html>
<head>
    <title>Options de jeu</title>
    <link rel="stylesheet" type="text/css" href="../css/styles.css">
</head>
<body class="container">
    <?php
    $options = isset($_GET['options']) ? $_GET['options'] : '';
    $timer = isset($_POST['timer']) ? $_POST['timer'] : '';
    $move = isset($_POST['move']) ? $_POST['move'] : '';
    ?>
    <form id="optionsForm" class="form_title" action="../../play.php?maps2=<?php echo $options; ?>&timer=<?php echo $timer; ?>" method="post">
        <label for="timer">Timer:</label><br>
        <input type="range" id="timer" name="timer" min="30" max="300" step="30" value="<?php echo $timer; ?>">
        <span id="timerValue" class="infos"><?php echo $timer; ?></span> secondes<br>
        <label for="move" class="infos">Bouger:</label><br>
        <select id="move" name="move" class="infos3">
            <option value="yes">Oui</option>
            <option value="no">Non</option>
        </select><br>
        <input type="submit" value="Jouer" class="valid-btn">
    </form>

    <script>
        var slider = document.getElementById("timer");
        var output = document.getElementById("timerValue");
        var form = document.getElementById('optionsForm');
        var moveSelect = document.getElementById('move');

        slider.oninput = function() {
            output.innerHTML = this.value;
            form.action = "../../play.php?maps2=<?php echo $options; ?>&timer=" + this.value + "&move=" + moveSelect.value;
        }

        moveSelect.onchange = function() {
            form.action = "../../play.php?maps2=<?php echo $options; ?>&timer=" + slider.value + "&move=" + this.value;
        }
    </script>
</body>
</html>
