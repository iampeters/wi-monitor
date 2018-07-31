<?php

    # Session
    session_start();

    # Headers
    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (isset($_SESSION['parent'])) {
        
        # Dependency
        require '../db.php';

        # session variables
        $key = $_SESSION['game'];
        $parent = $_SESSION['parent'];

        # Query to get ward_id from guardian tbl
        $sql = mysqli_query($conn, "SELECT ward_id from guardian where username = '$parent' ");

        if (mysqli_num_rows($sql) == 1) {
            $row = mysqli_fetch_assoc($sql);
            $ward_id = $row['ward_id'];

            # Query to get ward usrname from users tbl
            $sql1 = mysqli_query($conn, "SELECT username from users where user_id = '$ward_id' ");
           if(mysqli_num_rows($sql1) > 0)  {
                $rows = mysqli_fetch_assoc($sql1);
                $username = $rows['username'];

           } else {
               # Error
               echo '{
                   "success" : false
               }';
           }

        } else {
            echo '{
                "success" : false,
                "message" : "Sorry! ward does not exist"
            }';
        }

        # Query 3
        $sql3 = mysqli_query($conn, "SELECT * from chat where (sender = '$username' and receiver = '$parent' ) or (sender = '$parent' and receiver = '$username' ) ");

        # Array
        $chats = array();
        
        if (mysqli_num_rows($sql3) > 0) {


            # Loop
            while( $rows = mysqli_fetch_assoc($sql3)) {
                $sender = $rows['sender'];
                $receiver = $rows['receiver'];
                $message = $rows['message'];
                # $mid = $rows['id'];

                $chats[] = $rows;

                // if ($sender == $username) {
                //     echo '<span class="c-right bg-info mb-2">'.$message.'</span>';

                // } else {
                //     echo '<span class="c-left bg-info mb-2">'.$message.'</span>';

                // }
                
            }

            # Return result
            echo json_encode($chats);

        } else {
            # when there is no chat 
            echo json_encode($chats);
        }



    } else {
        # No session
        echo '{
            "success" : false,
            "message" : "You must be logged in first"
        }';

    }
    
    