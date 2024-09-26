<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GeoSeeker - Vérification de mail</title>
</head>
<body>
    <?php
        $pdo = new PDO('mysql:host=2g2yu.myd.infomaniak.com;dbname=2g2yu_geoseeker', '2g2yu_sharps', 'ZK&t2b@hJBuZSp?');

        $token = $_GET['token'];

        $stmt = $pdo->prepare("SELECT id FROM users WHERE verification_token = :token");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        if ($stmt->fetch()) {
            $stmt = $pdo->prepare("UPDATE users SET verification_token = NULL WHERE verification_token = :token");
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            echo "Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.";
        } else {
            echo "Le lien de vérification est invalide ou a déjà été utilisé.";
        }
        
    ?>
</body>
</html>