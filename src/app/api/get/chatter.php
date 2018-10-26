<?php

    # Session
    session_start();

    # Headers
    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (isset($_SESSION['uid'])) {

        # Dependencies
        require '../db.php';

        # Variables
        $key = $_SESSION['key'];
        $uid = $_SESSION['uid'];
        $username = $_SESSION['username'];



        # Query
        $sql = mysqli_query($conn, "SELECT id, username from guardian where ward_id = '$uid' ");

        if (mysqli_num_rows($sql) == 1) {
            $row = mysqli_fetch_assoc($sql);
            $guardian_id = $row['id'];
            $g_uname = $row['username'];

        } else {
            echo '{
                "success" : false,
                "message" : "Sorry! Guardian does not exist"
            }';
        }

        # Query 2
        $sql1 = mysqli_query($conn, "SELECT * from chat where (sender = '$username' and receiver = '$g_uname' ) or (sender = '$g_uname' and receiver = '$username' ) ");

        # Array
        $chats = array();

        if (mysqli_num_rows($sql1) > 0) {


            # Loop
            while( $rows = mysqli_fetch_assoc($sql1)) {
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

            # When there is no chat to display
            echo json_encode($chats);
        }




    } else {
        echo '{
            "message" : "You must be logged in"
        }';
    }
