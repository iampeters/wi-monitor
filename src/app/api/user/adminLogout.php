<?php 
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['admin'])) {
        
        # removes admin from the session global variable
        unset($_SESSION['admin']);

        echo '{
            "success": true
        }';
    }
    

?>