<?php
    # Session
    session_start();

    # Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json, charset=UTF-8');

    if (isset($_SESSION['key'])) {

        # Dependencies
        require '../db.php';

        $key = $_SESSION['key'];

         # Getting viewers
            $query = mysqli_query($conn, "SELECT viewers from game where session_key = '$key' ");
            $rows = mysqli_fetch_assoc($query);

            $viewers = $rows['viewers'];

            echo '{
                "success" : true,
                "message" : "'.$viewers.'"
            }';

    } else {
        echo '{
            "success" : false
        }';
    }