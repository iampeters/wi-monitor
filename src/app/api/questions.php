<?php 
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);
    
    if (isset($_POST['subject']) && !empty($_POST['subject'])) {
         // Database parameters
        $dbname = 'wi-monitor';
        $dbuser = 'root';
        $dbpass = "";
        $dbhost = 'localhost';

        // Establish database connection
        $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

        if (!$conn->connect_error) {

            $id = $_POST['subject'];

            $sql = "select subject from Subjects where subject_id = $id";

            $res = mysqli_query($conn, $sql);

            if(mysqli_num_rows($res) > 0) {

                $row = mysqli_fetch_assoc($res);

                $subject = $row['subject'];

                $_SESSION['subject'] = $subject;
                $_SESSION['subject_id'] = $id;

                echo '{
                    "success": true,
                    "message": "'.$subject.'"
                }';
            
            }
            else {
                echo '{
                    "success": false,
                    "message": "No record found"
                }';
            }

        } else {
            echo '{
                "success": false,
                "message": "Connection failed"
            }';
            
        }

     
    }
    else {
        echo '{
            "success": false,
            "message": "You must select a subject"
        }';
    }

?>