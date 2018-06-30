<?php
    header('Access-control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (isset($_POST) && !empty($_POST)) {

        $email = $_POST['email'];
        $password = $_POST['password'];



        if (!empty($email && $password)) {
            echo '{
                "success": true,
                "message": "Welcome to the admin page"
            }';
        } else {
            echo '{
                "success": false,
                "message": "Email/Password cannot be empty"
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