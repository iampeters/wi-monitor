<?php
    # starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    # Dependencies
    require '../db.php';


    # The below code would be used to constantly check if its a player's turn to play
    if ( isset($_SESSION['tid']) && isset( $_SESSION['uid'] ) ) {

        $tid = $_SESSION['tid'];
        $uid = $_SESSION['uid'];

        # Getting all from turns tbl
        $get = mysqli_query($conn, "select * from turns where tag_id ='$tid' and player_id ='$uid' ");

        if (mysqli_num_rows($get) == 1) {
            $rows = mysqli_fetch_assoc($get);

            $isTurn = $rows['is_player'];

            if ($isTurn == 0) {
                echo '{
                    "success": false,
                    "msg": false
                }';
            } else {
                echo '{
                    "success": true,
                    "msg": true
                }';
            }
            
            
        } else {
            echo '{
                "success": false,
                "message": "Oops! There are no turns to display"
            }';
        }
        

    } else {
        echo '{
            "success": false,
            "message": "Hehehe! Are you a learner?"
        }';
    }

?>