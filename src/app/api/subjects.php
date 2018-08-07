<?php 
    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    
    // Database parameters
    $dbname = 'wi-monitor';
    $dbuser = 'root';
    $dbpass = "";
    $dbhost = 'localhost';

    // Establish database connection
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

    if (!$conn->connect_error) {

        // query database
        $sql = "select subject_id, subject from Subjects";
        $query = mysqli_query($conn, $sql);

        // $query_waiting = mysqli_query($conn, "SELECT subject_id from tag where is_merged = 0 ");
        // if (mysqli_num_rows($query_waiting) > 0) {
        //     $wait_row = mysqli_fetch_assoc($query_waiting);
        //     $wait_sub = $wait_row['subject_id'];

        // } else {
        //     # if there are no waiting games
        //     echo '{
        //         $wait_sub = 
        //     }';
        // }

        if (mysqli_num_rows($query) > 0) {

            $stdds= array();

            while( $rows = mysqli_fetch_assoc( $query ) ) {

                $stdds[] = $rows;

            }
            
            // Convert array to json
            echo json_encode($stdds);
            
        }
        else {
            echo '{
                "message": "You have not added a subject yet"
            }';
        }
    }
    else {
        echo '{
            "message": "Error establishing database connetion"
        }';
    }

?>