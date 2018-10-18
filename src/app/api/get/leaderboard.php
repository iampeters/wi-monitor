<?php
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if(isset($_SESSION['uid'])) {
        
        # Database connection
        require '../db.php';

        # Standard Class
        $std = array();

        # Query
        $sql = mysqli_query($conn, "SELECT * FROM `points` ORDER BY points DESC limit 2");
        
        # Loop through the result
        while($rows = mysqli_fetch_assoc($sql)) {
            
            $std[] = $rows;

        }
        
        # Output
        return json_encode($std);

    } else {
        return '{
            "success" : false,
            "message" : "Access denied!"
        }';
    }

?>