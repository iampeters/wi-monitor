<?php

    # Headers
    header('Access-control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);


    # Checking if form was submitted
    if (isset($_POST['email']) && isset($_POST['password'])) {

        # Dependencies
        require '../db.php';
        
        # variables
        $email = $_POST['email'];
        $password = $_POST['password'];
        
        # Query
        $sql = mysqli_query($conn, "SELECT username, email from admin where ( username = '$email' or email = '$email') and password = '$password' ");

        if (mysqli_num_rows($sql) == 1) {

            $row = mysqli_fetch_assoc($sql);
            $admin = $row['username'];

            # Start session
            session_start();

            # Adding session variable
            $_SESSION['admin'] = $admin;

            # return true
            echo '{
                "success" : true
            }';

        } else {
            # return false
            echo '{
                "success" : false
            }';
        }
        
    }
    else {
        echo '{
            "success": false,
            "message": "Access denied! Only admins allowed"
        }';
    }
?>