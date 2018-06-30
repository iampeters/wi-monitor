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

            $fname = $_POST['fname'];
            $username = $_POST['username'];
            $password = $_POST['password'];

            $sql = "insert into users (username, fullname, password) values('$username', '$fname', '$password')";
            $query = mysqli_query($conn, $sql);

            if ($query) {
                
                echo '{
                    "success": true,
                    "message": "Account registered successfully. Click on Login button"
                }';

            } else {
                echo '{
                    "success": false
                    "message": "Username already taken"
                }';
            }
            
            
        }
    }
?>
