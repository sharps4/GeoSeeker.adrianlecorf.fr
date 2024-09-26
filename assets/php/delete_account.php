<?php
session_start();

// Vérifier si l'utilisateur est connecté   
if (isset($_SESSION['user_id'])) {
    $pdo = new PDO('mysql:host=2g2yu.myd.infomaniak.com;dbname=2g2yu_geoseeker', '2g2yu_sharps', 'ZK&t2b@hJBuZSp?');
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $user = $stmt->fetch();

    // Supprimer l'utilisateur de la base de données
    $stmt = $pdo->prepare('DELETE FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);

    // Déconnecter l'utilisateur et rediriger vers la page d'accueil
    session_destroy();
    header('Location: /index.php');
    exit;
}
header('Location: profil.php');
exit;
?>
