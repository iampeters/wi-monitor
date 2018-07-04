<?php
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['subject']) && isset($_SESSION['username'])) {

        echo '{
            "success" : true,
            "Subject" : "'.$_SESSION["subject"].'",
            "Username" : "'.$_SESSION["username"].'"
        }';
    }
    else {
        echo '{
            "success": false
        }';
    }
?>