<?php
session_start();

if (isset($_SESSION['user_id'])) {
    $pdo = new PDO('mysql:host=2g2yu.myd.infomaniak.com;dbname=2g2yu_geoseeker', '2g2yu_sharps', 'ZK&t2b@hJBuZSp?');
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $user = $stmt->fetch();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!empty($_POST['pseudo'])) {
            $new_pseudo = $_POST['pseudo'];
            $user['pseudo'] = $new_pseudo;
        } else {
            $new_pseudo = $user['pseudo'];
        }

        if (!empty($_POST['email'])) {
            $new_email = $_POST['email'];
            $user['email'] = $new_email;
        } else {
            $new_email = $user['email'];
        }

        // Vérifier si une photo de profil a été soumise
        if (!empty($_FILES['profil_picture']['tmp_name'])) {
            $profil_picture = file_get_contents($_FILES['profil_picture']['tmp_name']);
            $stmt = $pdo->prepare('UPDATE users SET pseudo = :pseudo, email = :email, profil_picture = :profil_picture WHERE id = :id');
            $stmt->execute([
                'pseudo' => $new_pseudo,
                'email' => $new_email,
                'profil_picture' => $profil_picture,
                'id' => $_SESSION['user_id']
            ]);
            $user['profil_picture'] = $profil_picture;
        } else {
            $stmt = $pdo->prepare('UPDATE users SET pseudo = :pseudo, email = :email WHERE id = :id');
            $stmt->execute([
                'pseudo' => $new_pseudo,
                'email' => $new_email,
                'id' => $_SESSION['user_id']
            ]);
        }
    }
} else {
    header('Location: /index.php');
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/styles.css">
    <title>GeoSeeker - Paramètres</title>
</head>
<body>
<div class="container">
    <div class="infos">
        <a href="profil.php" class="back">Retour</a>
    </div><br>

    <h2 class="subtitle">Modifier vos informations personnelles</h2>
    <form method="POST" enctype="multipart/form-data">
        <label for="pseudo">Pseudo :</label>
        <input type="text" name="pseudo" placeholder="<?= $user['pseudo'] ?>"><br>
        <label for="email">Email :</label>
        <input type="email" name="email" placeholder="<?= $user['email'] ?>"><br>
        <label for="profile_picture">Photo de profil :</label>
        <input type="file" name="profil_picture"><br>

        <input type="submit" value="Enregistrer">
    </form> <br><br>

    <div class="infos">
        <a href="delete_account.php" class="del-acc">Supprimer son compte</a>
    </div>
</div>
</body>
</html>
