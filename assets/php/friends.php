<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/styles.css">
    <title>GeoSeeker - Amis</title>
</head>
<body>
    <?php
        session_start();
        $pdo = new PDO('mysql:host=2g2yu.myd.infomaniak.com;dbname=2g2yu_geoseeker', '2g2yu_sharps', 'ZK&t2b@hJBuZSp?');
        
        if (isset($_POST['username'])) {
            $stmt = $pdo->prepare('SELECT * FROM users WHERE pseudo LIKE :username');
            $stmt->execute(['username' => '%' . $_POST['username'] . '%']);
            $users = $stmt->fetchAll();
        }
    ?>

    <?php if (isset($users)) : ?>
        <div class="search-results">
            <h2>Résultats de recherche:</h2>
            <ul>
                <?php foreach ($users as $user) : ?>
                    <li>
                        <?php echo $user['pseudo']; ?>
                        <form method="post" action="friends.php">
                            <input type="hidden" name="friend_id" value="<?php echo $user['id']; ?>">
                            <button type="submit">Ajouter</button>
                        </form>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <?php
        if (isset($_POST['friend_id'])) {
            $user_id = $_SESSION['user_id'];
            $friend_id = $_POST['friend_id'];
            $stmt = $pdo->prepare('INSERT INTO friends (user_id, friend_id) VALUES (:user_id, :friend_id)');
            $stmt->execute(['user_id' => $user_id, 'friend_id' => $friend_id]);
        }
    ?>

    <?php
        $user_id = $_SESSION['user_id'];
        $stmt = $pdo->prepare('SELECT users.* FROM users INNER JOIN friends ON friends.friend_id = users.id WHERE friends.user_id = :user_id');
        $stmt->execute(['user_id' => $user_id]);
        $friends = $stmt->fetchAll();
    ?>

    <?php if (isset($friends)) : ?>
        <div class="friends-container">
            <h2>Mes amis:</h2>
            <ul>
                <?php foreach ($friends as $friend) : ?>
                    <li><?php echo $friend['pseudo']; ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
</body>
</html>