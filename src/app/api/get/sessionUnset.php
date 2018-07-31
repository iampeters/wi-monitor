<?php
// starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['subject'])) {

        $key = $_SESSION['key'];
        $username = $_SESSION['username'];
         $id = $_SESSION['uid'];

        # Dependencies
        require '../db.php';

        # Updating scores
        $sql = mysqli_query($conn, "UPDATE scores set gave_up = '$username' where player_id = '$id' and session_key = '$key'  ");

        # Updating tag
        $sql2 = mysqli_query($conn, "UPDATE tag set has_ended = 'true' where session_key = '$key'  ");

        # Updating game
        $sql3 = mysqli_query($conn, "UPDATE game set has_ended = true where session_key = '$key'  ");

        # Unsetting the subject and id
        unset($_SESSION['subject']);
        unset($_SESSION['subject_id']);

        # Unsetting the game id
        unset($_SESSION['gid']);

        # Unsetting the tag id
        unset($_SESSION['tid']);

        # Unsetting the session key
        unset($_SESSION['key']);

        echo '{
            "success": true
        }';

    } else {
        
        echo '{
            "success": false
        }';
    }


?>