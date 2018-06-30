<?php
// starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['subject'])) {

        unset($_SESSION['subject']);
        unset($_SESSION['subject_id']);

        echo '{
            "success": true
        }';
    } else {
        echo '{
            "success": false
        }';
    }


?>