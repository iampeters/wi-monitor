<?php
    header('Access-control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (isset($_POST)) {

        // Saving the values
        $username = $_POST['username'];
        $ward_id = $_POST['ward'];
        $fullname = $_POST['guardian'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];
        $relationship = $_POST['relationship'];
        
        // Dependencies
        require '../db.php';

        // Checking if the username is available
        $sql = mysqli_query($conn, "SELECT username from guardian where username = '$username' ");
        if (mysqli_num_rows($sql) > 0) {
            echo '{
                "success" : false,
                "message" : "Sorry! Username already taken"
            }';
        } else {

            // Inserting new guardian if username is available
            $query = mysqli_query($conn, "INSERT INTO guardian Values('', '$username', '$ward_id', '$fullname', '$email','$phone','$relationship')");

            if ($query) {
                echo '{
                    "success" : true,
                    "message" : "Guardian inserted successfully"
                }';
            } else {
                echo '{
                    "success" : false,
                    "message" : "Oops! Could not insert guardian at this time"
                }';
            }
        }
        
        

    } else {
        echo '{
                "success" : false,
                "message" : "Are you a learner?!"
            }';
    }
    
?>