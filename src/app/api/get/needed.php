<?php

    # Session
    session_start();

    # Headers
    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);
    # Dependency
    require '../db.php';

    if (isset($_SESSION['parent'])) {
        

        # session variables
        $key = $_SESSION['game'];
        $parent = $_SESSION['parent'];

        # Query to get ward_id from guardian tbl
        $sql = mysqli_query($conn, "SELECT ward_id from guardian where username = '$parent' and needed = 1 ");

        if (mysqli_num_rows($sql) == 1) {
            $row = mysqli_fetch_assoc($sql);
            $ward_id = $row['ward_id'];

            echo '{
                "success" : true
            }';
            
        } else {
            echo '{
                "success" : false
            }';
        }
    }

    # this will open the chat dialog
    if (isset($_POST['open'])) {
        
        $username = $_SESSION['username'];
        $uid = $_SESSION['uid'];

        # Query to get guardian from guardian tbl
        $sql = mysqli_query($conn, "SELECT username from guardian where ward_id = '$uid'");

        if (mysqli_num_rows($sql) == 1) {
            $row = mysqli_fetch_assoc($sql);
            $g_uname = $row['username'];

            echo '{
                "success" : true
            }';
            
        } else {
            echo '{
                "success" : false
            }';
        }

        $sql = mysqli_query($conn, "UPDATE guardian set needed = 1 where username = '$g_uname' and ward_id = '$uid' ");
    }

    # This will close the chat dialog
     if (isset($_POST['close'])) {
        
        $username = $_SESSION['username'];
        $uid = $_SESSION['uid'];

        # Query to get guardian from guardian tbl
        $sql = mysqli_query($conn, "SELECT username from guardian where ward_id = '$uid' and needed = 1");

        if (mysqli_num_rows($sql) == 1) {
            $row = mysqli_fetch_assoc($sql);
            $g_uname = $row['username'];

            echo '{
                "success" : true
            }';
            
        } else {
            echo '{
                "success" : false
            }';
        }

        $sql = mysqli_query($conn, "UPDATE guardian set needed = 0 where username = '$g_uname' and ward_id = '$uid' ");
    }