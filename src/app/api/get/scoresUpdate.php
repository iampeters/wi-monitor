<?php
    # starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if ( isset($_SESSION['key']) && isset($_SESSION['uid'])) {

        # Dependencies
        require '../db.php';

        # Standard Class
        $list = new stdClass();

        # Saving session variables
        $gid = $_SESSION['gid'];
        $tid = $_SESSION['tid'];
        $key = $_SESSION['key'];
        $sid = $_SESSION['subject_id'];
        $player_id = $_SESSION['uid'];

        #Get the current value of the user's correct answers
        $sql = mysqli_query($conn, "SELECT correct, wrong, questions, scores from scores where player_id = '$player_id' and session_key = '$key' ");
        
        if ( mysqli_num_rows($sql) == 1 ) {
            
            $row = mysqli_fetch_assoc($sql);
            $list->p_correct = $row['correct'] ;
            $list->p_scores = $row['scores'];
            $list->p_wrong = $row['wrong'];
            $list->p_questions = $row['questions'];
            $list->success = true;

            # Return result
            echo json_encode($list);
            
            exit();
        }
        else {

            $list->success = false;
            $list->p_wrong = 0;
            $list->p_scores = 0;
            $list->p_correct = 0;
            $list->p_questions = 0;

            # Return result
            echo json_encode($list);
            
            exit();
        }

    }
    else {
        # If no one is logged in
        echo '{
            "success": false,
            "message" : "How did you get here?"
        }';

        exit();
    }
    


?>