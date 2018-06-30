<?php 
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);
    
    if (isset($_POST['username']) && !empty($_POST['username'])) {
         // Database parameters
        $dbname = 'wi-monitor';
        $dbuser = 'root';
        $dbpass = "";
        $dbhost = 'localhost';

        // Establish database connection
        $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

        if (!$conn->connect_error) {
            $username = $_POST['username'];
            $password = $_POST['password'];

            $sql = "select * from users where username ='$username' and password = '$password'";
            $query = mysqli_query($conn, $sql);

            if (mysqli_num_rows($query) == 1) {
                $row = mysqli_fetch_assoc($query);
                $fname = $row['fullname'];
                $id = $row['user_id'];

                $_SESSION['username'] = $username;
                $_SESSION['fullname'] = $fname;
                $_SESSION['uid'] = $id;


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
    }
?>
