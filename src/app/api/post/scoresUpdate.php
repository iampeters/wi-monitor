<?php
    # starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    if ( isset($_SESSION['key']) && isset( $_POST['right'])) {

        # Dependencies
        require '../db.php';

        # Saving session variables
        $gid = $_SESSION['gid'];
        $tid = $_SESSION['tid'];
        $key = $_SESSION['key'];
        $sid = $_SESSION['subject_id'];

        # Post values
        $right = $_POST['right'];
        $player_id = $_SESSION['uid'];
        $score = 5;

        #Get the current value of the user's correct answers
        $sql = mysqli_query($conn, "select correct, scores from scores where player_id = '$player_id' and session_key = '$key' ");
        
        if ( mysqli_num_rows($sql) > 0 ) {
            
            $row = mysqli_fetch_assoc($sql);
            $correct_value = $row['correct'] ;
            $scores = $row['scores'];

            $new_value = $correct_value + 1;
            $new_scores = $scores + 5; 

            # Inserting the current value of the correct choices
            $correct_update = mysqli_query( $conn, "update scores set correct = '$new_value', scores = '$new_scores' " );

            echo '{
                "success": true,
                "value": "'.$new_value.'",
                "scores": "'.$new_scores.'"
            }';
        }
        else {

            # Inserting the current value of the correct choices
            $correct_insert = mysqli_query( $conn, "insert into scores (score_id, player_id, correct, scores, game_id, tag_id, subject_id, session_key) values ('', '$player_id', '$right', '$score', '$gid', '$tid','$sid', '$key') " );

            echo '{
                "success": true,
                "value": 1,
                "scores": 5
            }';
        }
        

    } elseif ( isset($_SESSION['key']) && isset( $_POST['wrong']) ) {

        # Dependencies
        require '../db.php';
        
        # Saving session variables
        $gid = $_SESSION['gid'];
        $tid = $_SESSION['tid'];
        $key = $_SESSION['key'];

        # Post values
        $wrong = $_POST['wrong'];
        $player_id = $_SESSION['uid'];

        #Get the current value of the user's correct answers
        $sql = mysqli_query($conn, "select wrong from scores where player_id = '$player_id' and session_key = '$key' ");
        
        if ( mysqli_num_rows($sql) == 1 ) {
            
            $row = mysqli_fetch_assoc($sql);
            $wrong_value = $row['wrong'] ;

            $new_value = $wrong_value + 1;

            # Inserting the current value of the correct choices
            $wrong_update = mysqli_query( $conn, "update scores set wrong = '$new_value' " );

            echo '{
                "success": true,
                "value": "'.$new_value.'"
            }';
        }
        else {
            # Inserting the current value of the correct choices
            $wrong_insert = mysqli_query( $conn, "insert into scores (score_id, player_id, wrong, game_id, tag_id, subject_id, session_key) values ('', '$player_id', '$wrong', '$gid', '$tid','$sid', '$key') " );

            echo '{
                "success": true,
                "value": 1
            }';
        }

    }
    else {
        # 
        echo '{
            "success": false,
            "message" : "How did you get here?"
        }';
    }
    


?>