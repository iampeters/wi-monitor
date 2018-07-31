<?php
    # starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    # Dependencies
    require '../db.php';

    $query = mysqli_query($conn, "SELECT username, user_id from users");

    if (mysqli_num_rows($query) > 0) {

        // Creating an array to store users
        $std = array();

        while($rows = mysqli_fetch_assoc($query)) {
            
            $std[] = $rows;
        }

        // Converting array to json
        echo json_encode($std);

    } else {
        echo '{
            "message" : "No ward to display"
        }';
    }
    

?>