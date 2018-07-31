<?php

    # Session
    session_start();

    # Headers
    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    
    if (isset($_SESSION['parent'])) {
        
        # Unset session
        unset($_SESSION['parent']);
        unset($_SESSION['game']);
        unset($_SESSION['wid']);
        unset($_SESSION['parent_id']);

        echo '{
            "success" : true
        }';
    }