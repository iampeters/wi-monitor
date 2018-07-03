<?php

    // Database parameters
    $dbname = 'wi-monitor';
    $dbuser = 'root';
    $dbpass = "";
    $dbhost = 'localhost';

    // Establish database connection
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

    if ($conn->connect_error) {
        echo '{
            "success": false,
            "message": "Unable to connect to database"
        }';
    }

?>