<?php

    # Session
    session_start();

    # Header
    header('Access-Control-Allow-Origin: *');

    if (isset($_GET['gid'])) {
        $key = $_GET['gid'];

        # Dependency
        require 'db.php';

        # Get tag
        $sql = mysqli_query($conn, "SELECT * from tag where session_key = '$key'  ");

        if ( mysqli_num_rows($sql) == 1 ) {
            $rows = mysqli_fetch_assoc($sql);

            $player_id = $rows['player_id'];
            $opponent_id = $rows['opponent_id'];
            $subject_id = $rows['subject_id'];


            
        } else {
            echo $message = 'Sorry! There are no games with that key';
        }

        # Get questions
        $getQuestion = mysqli_query($conn, "SELECT * FROM vQues WHERE session_key = '$key' order by id desc limit 1");
        


    } else {
        # Goto login page
        // headers('location: ../index.php');
        echo 'Not allowed';
    }
    

?>