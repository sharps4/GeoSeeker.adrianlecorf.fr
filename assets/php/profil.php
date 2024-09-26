<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="../css/styles.css">
    <title>GeoSeeker - Profil de <?=$user['pseudo']?></title>
</head>
<body>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="../css/styles.css">
    <title>Profil</title>
</head>
<body>
<?php
    session_start(); 

    $pdo = new PDO('mysql:host=2g2yu.myd.infomaniak.com;dbname=2g2yu_geoseeker', '2g2yu_sharps', 'ZK&t2b@hJBuZSp?');

    // Vérifie si un utilisateur est connecté et récupère ses informations s'il l'est
    $user = null;
    if (isset($_SESSION['user_id'])) {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
        $stmt->execute(['id' => $_SESSION['user_id']]);
        $user = $stmt->fetch();

        $stmt = $pdo->prepare('SELECT score as max_score FROM scores WHERE user_id = :user_id');
        $stmt->execute(['user_id' => $_SESSION['user_id']]);
        $row = $stmt->fetch();
        $max_score = $row ? $row['max_score'] : null;
    }

    // Si le pseudo est spécifié dans l'URL, récupère les informations de l'utilisateur correspondant
    $user_id = isset($_GET['user']) ? $_GET['user'] : null;

    if (!$user_id && $user) {
        // redirige vers son propre profil
        $user_id = $user['pseudo'];
    }

    if ($user_id) {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE pseudo = :pseudo');
        $stmt->execute(['pseudo' => $user_id]);
        $user = $stmt->fetch();

        $stmt = $pdo->prepare('SELECT score as max_score FROM scores WHERE user_id = (SELECT id FROM users WHERE pseudo = :pseudo)');
        $stmt->execute(['pseudo' => $user_id]);
        $row = $stmt->fetch();
        $max_score = $row ? $row['max_score'] : null;
    }
?>

<div class="profil-infos-container">
    <div class="profil-infos">
        <?php if ($user['profil_picture']) : ?>
            <img class="profil-pic" src="data:image/jpeg;base64,<?=base64_encode($user['profil_picture'])?>" alt="Photo de profil" />
        <?php else : ?>
            <p>Aucune photo de profil</p>
        <?php endif; ?>
        <h1><?=$user['pseudo']?></h1>
    </div>
</div>

    <!-- <h2 class="stats-title">Statistiques</h2> -->

    <div class="stats-all">
        <div class="stats-container">
            <div class="stats">
                <div class="stats-card stats-card-container">
                    <div class="stats-card_desc"><?= $max_score?></div>
                    <p class="stats-subtitle">Meilleur score</p>
                </div>
                <div class="stats-card stats-card-container">
                    <div class="stats-card_desc">Test</div>
                </div>
                <div class="stats-card stats-card-container">
                    <div class="stats-card_desc">Test</div>
                </div>
                <div class="stats-card stats-card-container">
                    <div class="stats-card_desc">Test</div>
                </div>
                <div class="stats-card stats-card-container">
                    <div class="stats-card_desc">Test</div>
                </div>
                <div class="stats-card stats-card-container">
                    <div class="stats-card_desc">Test</div>
                </div>
            </div>
        </div>
    </div>

    <?php if (isset($_SESSION['user_id']) && ($user['id'] === $_SESSION['user_id'] || !isset($_GET['user']))) : ?>
        <div class="edit-infos">
            <a class="edit-btn" href="settings.php">Editer mes informations<i class="fa-solid fa-pen"></i></a>
        </div>
    <?php endif; ?>

</body>
</html>