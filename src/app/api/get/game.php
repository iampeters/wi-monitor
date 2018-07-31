<?php
// starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['parent'])) {
        
        # Dependencies
        require '../db.php';

        # SQL Query
        $sql = mysqli_query($conn, "SELECT session_key from game where has_ended = 0 ");

        if (mysqli_num_rows($sql) > 0) {
            
            # Array
            $std = array();

            # rows
            while($rows = mysqli_fetch_assoc($sql)) {
                $std[] = $rows;
            }

            # Returning the json values

            echo json_encode($std);

        } else {
            
            # This would be displayed if there are currently no ongoing game
            echo '{
                "success" : false,
                "message" : "Sorry! There are no games to display"
            }';
        }
        
    } else {
        echo '{
            "success" : false,
            "message" : "Seriously! Do you really wanna do this?"
        }';
    }
    
?>