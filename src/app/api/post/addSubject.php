<?php
    header('Access-control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (isset($_POST['subject'])) {

        $subject = $_POST['subject'];

        // Establishing database connection
        require '../db.php';

        // Query
        $query = mysqli_query($conn, "insert into Subjects (subject) values('$subject')");
        if ($query) {
            echo'{
                "success": true,
                "message": "Subject added successfully"
            }';
        } 
        else {
            echo'{
                "success": false,
                "message": "Sorry! Subject already exist in the server"
            }';
        }
        
    } 
    else {
         echo '{
            "success": false,
            "message": "Please enter a subject to add"
        }';
    }
    
?>