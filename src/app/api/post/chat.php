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
                "message" : "Nothing to display"
            }';
        }

        $sql1 = mysqli_query($conn, "INSERT INTO chat values(null, '$username', '$g_uname', '$key', '$msg') ");

        if ($sql1) {

            $update = mysqli_query($conn, "UPDATE guardian set needed = 1 where username = '$g_uname' and ward_id = '$uid'  ");
            if (!$update) {
                echo '{
                    "message" : "Could not get help"
                }';
            }
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
