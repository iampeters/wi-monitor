<?php

/*
    THE SCRIPT BELOW WILL DECREMENT QUESTIONS WHEN THE USER CLICKS ON SUBMIT OR HIS TIME ELASPSES
*/

    # starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    # Dependency
    require '../db.php';

    if (isset($_SESSION['uid']) and isset($_SESSION['key'])) {
        
        # session key
        $uid = $_SESSION['uid'];
        $key = $_SESSION['key'];

        # Get current question
        $get_ques = mysqli_query($conn, "SELECT questions from scores where player_id = '$uid' and session_key = '$key' ");

        if (mysqli_num_rows($get_ques) == 1) {
            $row = mysqli_fetch_assoc($get_ques);
            $question = $row['questions'];
            $new = $question - 1;

            # Update questions column
            $update = mysqli_query($conn, "UPDATE scores set questions = '$new' where session_key = '$key' and player_id = '$uid' ");

            if ($update) {
                echo 'Updated';
            } else {
                echo 'Update failed';
            }



        } else {
            # code...
            echo 'Nothing came';
        }
        


    } else {
        # code...
        echo '{
            "success" : false,
            "message" : "You must be be logged in to view this page"
        }';
    }
    