<?php 
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    

   if (isset($_SESSION['username'])) {
         // Database parameters
        $dbname = 'wi-monitor';
        $dbuser = 'root';
        $dbpass = "";
        $dbhost = 'localhost';

        // Establish database connection
        $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

        if (!$conn->connect_error) {
            $username = $_SESSION['username'];

            $sql = "select * from users where username ='$username'";
            $query = mysqli_query($conn, $sql);

            if (mysqli_num_rows($query) == 1) {
                $row = mysqli_fetch_assoc($query);
                $fname = $row['fullname'];
                $id = $row['user_id'];


                echo '{
                    "success": true,
                    "username": "'.$username.'",
                    "fullname": "'.$fname.'"
                }';
                
            } else {
                echo '{
                    "success": false,
                    "message": "Username/Password incorrect"
                }';
            }
            
            
        }
    } else {
        echo '{
            "success" : false
        }';
    }
    


?>