<?php
session_start();
$pdo = new PDO('mysql:host=2g2yu.myd.infomaniak.com;dbname=2g2yu_geoseeker', '2g2yu_sharps', 'ZK&t2b@hJBuZSp?');

if (isset($_POST['score'])) {
  $score = $_POST['score'];
  if ($score > 25000) {
    echo "Le score ne peut pas être supérieur à 25000.";
    exit;
  }
  $user_id = $_SESSION['user_id']; 
  
  // Vérifier si l'utilisateur a déjà un score enregistré
  $stmt = $pdo->prepare("SELECT * FROM scores WHERE user_id = :user_id");
  $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
  $stmt->execute();
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  
  if ($row) {
    $error = $stmt->errorInfo();
    // L'utilisateur a déjà un score enregistré, vérifier si le nouveau score est plus grand
    if ($score > $row['score']) {
      // Le nouveau score est plus grand, mettre à jour le score existant
      $stmt = $pdo->prepare("UPDATE scores SET score = :score WHERE user_id = :user_id");
      $stmt->bindValue(':score', $score, PDO::PARAM_INT);
      $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
      
      if ($stmt->execute()) {
        echo "Le score a été mis à jour avec succès !";
      } else {
        $error = $stmt->errorInfo();
        echo "Erreur lors de la mise à jour du score.";
      }
    } else {
      echo "Votre score est inférieur à votre meilleur score, il ne sera pas enregistré.";
    }
  } else {
    // L'utilisateur n'a pas encore de score enregistré, insérer le nouveau score
    $stmt = $pdo->prepare("INSERT INTO scores (score, user_id) VALUES (:score, :user_id)");
    $stmt->bindValue(':score', $score, PDO::PARAM_INT);
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
      echo "Le score a été enregistré avec succès !";
    } else {
      echo "Erreur lors de l'enregistrement du score.";
    }
  }
} else {
  $error = $stmt->errorInfo();
  echo "Le score n'a pas été transmis.";
}

?>