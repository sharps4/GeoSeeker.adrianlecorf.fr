<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--CSS-->
    <link rel="stylesheet" href="assets/css/styles.css"> 
    <!--Font-->
    <link rel="stylesheet" href="https://use.typekit.net/mfh2zpo.css">
    <!--JS-->
    <script src="https://unpkg.com/@googlemaps/js-api-loader@1.0.0/dist/index.min.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <title>GeoSeeker</title>
</head>
    <?php
    session_start();

    if (isset($_SESSION['user_id'])) {
        $pdo = new PDO('database');
        $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
        $stmt->execute(['id' => $_SESSION['user_id']]);
        $user = $stmt->fetch();
    }

    if (isset($user)) {
        $stmt = $pdo->prepare('SELECT users.id, users.pseudo FROM friends INNER JOIN users ON friends.friend_id = users.id WHERE friends.user_id = :user_id');
        $stmt->execute(['user_id' => $user['id']]);
        $friends = $stmt->fetchAll();
    }
    ?>

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

    <!--Main content-->
    <main>
        <section>
            <div class="container">
                    <!-- <div class="title">
                        <h1>GeoGuessr</h1>
                    </div>   -->
                    <?php if (isset($user)) : ?>
                        <div class="title-container">
                            <div class="username">
                                <span>Bonjour, <span class="span2"><?php echo $user['pseudo'];?></span></span>
                                <a href="assets/php/profil.php"><img class="profil-pic" src="data:image/jpeg;base64,<?=base64_encode($user['profil_picture'])?>" alt="Photo de profil" /></a>
                                <a class="logout-btn" href="assets/php/logout.php"><i class="fa-solid fa-right-from-bracket"></i></a>
                            </div>
                        </div>
                    <!-- Sinon, afficher les boutons S'inscrire et Se connecter -->
                    <?php else : ?>
                        <div class="title-container">
                            <div class="signup">
                                <a href="signup.html">Se connecter</a>
                            </div>
                            <div class="signin">
                                <a href="signin.html">S'inscrire</a>
                            </div>
                        </div>
                    <?php endif; ?>

                <!--Map selector-->
                <div class="selector-all">
                    <div class="selector-container">
                        <div class="selector">
                            <div class="card card1"></div>
                            <div class="card_desc">Map: Monde</div>
                            <div class="play">
                                <a href="assets/php/options_map.php">Jouer</a>
                            </div>
                        </div>
                        <div class="selector">
                            <div class="card card2"></div>
                            <div class="card_desc">Map: France</div>
                            <div class="play">
                                <a href="assets/php/options_map.php?options=france">Jouer</a>
                            </div>
                        </div>
                        <div class="selector">
                            <div class="card card3"></div>
                            <div class="card_desc">Map: Roumanie</div>
                            <div class="play">
                                <a href="assets/php/options_map.php?options=romania">Jouer</a>
                            </div>
                        </div>
                    </div>

                    <div class="leaderboard-container">
                        <div class="lb-title">Classement</div>
                        <hr class="lb-hr">
                        <?php
                            $pdo = new PDO('mysql:host=2g2yu.myd.infomaniak.com;dbname=2g2yu_geoseeker', '2g2yu_sharps', 'ZK&t2b@hJBuZSp?');

                            $sql = "SELECT scores.score, users.pseudo
                                    FROM scores
                                    INNER JOIN users ON scores.user_id = users.id
                                    ORDER BY scores.score DESC";
                            $stmt = $pdo->query($sql);

                            // Afficher les résultats
                            echo '<div class="lb-text-container">';
                            $position = 1;
                            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                                echo '<div class="lb-text"> <p>' . $position. "." . '</p><p><a href="assets/php/profil.php?user=' . $row['pseudo'] . '">' . $row['pseudo'] . '</a></p><p>' . $row['score'] . "pts" . '</p></div>'."<br>";
                                $position++;
                            }
                            echo '</div>';
                            ?>
                    </div>
                </div>  
                <div class="add-friend-container">
                    <form method="post" action="assets/php/friends.php">
                        <label for="username">Rechercher un ami:</label>
                        <input type="text" id="username" name="username" placeholder="pseudo" required>
                        <button class="search-btn" type="submit">Rechercher</button>
                    </form>
                </div>
            </div>
        </section>
    </main>
</body>
</html>
