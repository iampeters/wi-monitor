<?php
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['subject'])) {

        echo '{
            "success": true,
            "Subject":"'.$_SESSION["subject"].'"
        }';
    }
    else {
        echo '{
            "success": false
        }';
    }
?>