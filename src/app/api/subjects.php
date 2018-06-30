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

        // file to store our query
        $file = "/opt/lampp/htdocs/data.json";
        if(!file_exists($file)){
            touch($file);
            chmod($file, 0777);
        }
        $f = fopen($file, 'w+'); // Open in write mode

        // query database
        $sql = "select subject_id, subject from Subjects";
        $query = mysqli_query($conn, $sql);

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