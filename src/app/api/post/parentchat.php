<?php

    # Session
    session_start();

    # Headers
    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (isset($_POST['message']) && !empty($_POST)) {

        # Validate
        function validate($data) {
	      $data = trim($data);
	      $data = strip_tags($data);
	      $data = stripslashes($data);
	      $data = htmlspecialchars($data);
	      $data = nl2br($data);
          return $data;
          
	    }

        # Dependencies
        require '../db.php';

        # Variables
        $msg = validate($_POST['message']);
        $key = $_SESSION['game'];
        $pid = $_SESSION['parent_id'];
        $parent = $_SESSION['parent'];


        # Query 1
        $sql = mysqli_query($conn, "SELECT ward_id from guardian where username = '$parent' ");

        if (mysqli_num_rows($sql) == 1) {
            $row = mysqli_fetch_assoc($sql);
            $ward_id = $row['ward_id'];

            $query = mysqli_query($conn, "SELECT username from users where user_id = '$ward_id' ");
            $rows = mysqli_fetch_assoc($query);
            $ward = $rows['username'];

        } else {
            echo '{
                "success" : false,
                "message" : "Nothing to display"
            }';
        }

        # Query 2
        $sql1 = mysqli_query($conn, "INSERT INTO chat values(null, '$parent', '$ward', '$key', '$msg') ");

        if ($sql1) {
            echo '{
                "success" : true,
                "message" : "Inserted"
            }';
        }

       
    } else {
        echo '{
            "message" : "Please enter a message"
        }';
    }