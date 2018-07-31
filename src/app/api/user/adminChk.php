<?php
    # Start session
    session_start();
    
    header('Access-control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['admin'])) {
        # return true
        echo '{
            "success" : true
        }';

    } else {
        # return false
        echo '{
            "success" : false
        }';
    }
    