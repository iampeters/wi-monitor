<?php
    header('Access-control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (isset($_POST)) {

        # Dependencies
        require '../db.php';
        
        // Saving post data
        $username = $_POST['username'];
        $ward = $_POST['ward'];

        // Getting ward id
        $query = mysqli_query ($conn, "SELECT * from users where username = '$ward' ");
        if (mysqli_num_rows($query) == 1) {

            $rows = mysqli_fetch_assoc($query);

            $user_id = $rows['user_id'];

            // Checking if this guardian is associated with the ward

            $sql = mysqli_query($conn, "SELECT id, username, ward_id from guardian where username ='$username' and ward_id = '$user_id' ");     

            if (mysqli_num_rows($sql) == 1) {
                
                $row = mysqli_fetch_assoc($sql);
                $guardian_id = $row['id'];

                // starting session
                session_start();

                $_SESSION['wid'] = $user_id;
                $_SESSION['parent'] = $username;
                $_SESSION['parent_id'] = $guardian_id;

                echo '{
                    "success" : true,
                    "parent" : "'.$username.'",
                    "ward" : "'.$ward.'",
                    "ward_id" : "'.$user_id.'"
                }';
            } else {
                echo '{
                "success" : false,
                "message" : "Invalid login credentials"
            }';
            }
            

        } else {
            echo '{
                "success" : false,
                "message" : "Invalid credentials"
            }';
        }
        
    } else {
        echo '{
            "message" : "Are you a learner?!"
        }';
    }
?>