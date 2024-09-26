<?php
$pdo = new PDO('mysql:host=2g2yu.myd.infomaniak.com;dbname=2g2yu_geoseeker', '2g2yu_sharps', 'ZK&t2b@hJBuZSp?');

$email = $_POST['email'];
$password = $_POST['password'];

// Requête pour récupérer l'utilisateur correspondant à l'email
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

// Vérification du mot de passe
if ($user != null && password_verify($password, $user['password'])) { 
    // Vérification de l'état de la vérification du mail
    if ($user['verification_token'] != null) {
        die('Vous devez d\'abord valider votre adresse email pour vous connecter.');
    }
    
    // Les informations sont correctes, on connecte l'utilisateur
    session_start();
    $_SESSION['user_id'] = $user['id'];
    header('Location: /index.php'); 
    exit();
} else {
    echo 'Adresse email ou mot de passe incorrect.';
}

?>