<?php
$pseudo = htmlspecialchars($_POST['pseudo'], ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8');
$password = $_POST['password'];

try {
    $pdo = new PDO('mysql:host=2g2yu.myd.infomaniak.com;dbname=2g2yu_geoseeker', '2g2yu_sharps', 'ZK&t2b@hJBuZSp?');
} catch (PDOException $e) {
    die("La connexion à la base de données a échoué : " . $e->getMessage());
}

$pseudos_interdits = array('admin', 'Admin', 'moderateur', 'webmaster', 'root', 'administrateur', 'administratrice', 'Hitler', 'hitler', 'hittler', 'staline', 'stalin', 'Staline', 'Staline', 'Nazis', 'nazis', 'génocide', 'genocide');

if (in_array($pseudo, $pseudos_interdits)) {
    die("Ce pseudo est interdit. Veuillez en choisir un autre.");
}

// vérifier si le pseudo existe déjà
$stmt = $pdo->prepare("SELECT id FROM users WHERE pseudo = :pseudo");
$stmt->bindParam(':pseudo', $pseudo);
$stmt->execute();
if ($stmt->fetch()) {
    die("Ce pseudo est déjà utilisé. Veuillez en choisir un autre.");
}

// vérifier si l'email existe déjà
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
$stmt->bindParam(':email', $email);
$stmt->execute();
if ($stmt->fetch()) {
    die("Cet email est déjà utilisé. Veuillez en choisir un autre.");
}

//vérifier le longueur du mot de passe
if (strlen($password) < 8) {
    die("Le mot de passe doit contenir au moins 8 caractères.");
}

if (strlen($email) < 10) {
    die("L'adresse mail est trop courte.");
}


$verification_token = bin2hex(random_bytes(16));

$stmt = $pdo->prepare("INSERT INTO users (pseudo, email, password, verification_token) VALUES (:pseudo, :email, :password, :verification_token)");
$stmt->bindParam(':pseudo', $pseudo);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', password_hash($password, PASSWORD_DEFAULT));
$stmt->bindParam(':verification_token', $verification_token);


$to = $email;
$subject = 'Vérification de votre compte sur GeoSeeker';
$message = 'Bonjour ' . $pseudo . ',<br><br>
            Merci de vous être inscrit sur GeoSeeker. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :<br><br>
            <a href="https://geoseeker.adrianlecorf.fr/assets/php/mail_verification.php?token=' . $verification_token . '">Vérifier mon compte</a><br><br>
            Cordialement,<br>
            L\'équipe de GeoSeeker';
$headers = 'From: contact@adrianlecorf.fr' . "\r\n" .
           'Reply-To: contact@adrianlecorf.fr' . "\r\n" .
           'Content-type: text/html; charset=UTF-8' . "\r\n" .
           'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);

if ($stmt->execute()) {
    // echo "Les données ont été enregistrées avec succès.";
    session_start();
    $_SESSION['user_id'] = $pdo->lastInsertId();
    header('Location: /index.php'); 
    exit();
} else {
    echo "Erreur : " . $stmt->errorInfo()[2];
}
?>