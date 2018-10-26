<?php
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (isset($_POST['choice'])) {

        # session variables
        $choice = $_POST['choice'];
        $right = 1;
        $score = 5;
        $wrong = 1;

        # Session
        $gid = $_SESSION['gid'];
        $tid = $_SESSION['tid'];
        $key = $_SESSION['key'];
        $sid = $_SESSION['subject_id'];
        $player_id = $_SESSION['uid'];
        $ques_id = $_SESSION['questions_id'];
        $sub_id = $_SESSION['subject_id'];

        # Dependency
        require '../db.php';

        $sql = mysqli_query($conn, "SELECT answer from questions where questions_id = '$ques_id' and answer = '$choice' ");

        if (mysqli_num_rows($sql) == 1) {
            $rows = mysqli_fetch_assoc($sql);

            # Correct answer
            $answer = $rows['answer'];

            #Get the current value of the user's correct answers
            $sql2 = mysqli_query($conn, "SELECT correct, scores from scores where player_id = '$player_id' and session_key = '$key' ");

            if ( mysqli_num_rows($sql2) == 1 ) {

                $row = mysqli_fetch_assoc($sql2);
                $correct_value = $row['correct'] ;
                $scores = $row['scores'];

                $new_value = $correct_value + 1;
                $new_scores = $scores + 5;

                # update scores tbl with the current value of the correct choices
                $correct_update = mysqli_query( $conn, "UPDATE scores set correct = '$new_value', scores = '$new_scores', timer = 0 where player_id = '$player_id' " );

                echo '{
                    "success": true,
                    "value": "'.$new_value.'",
                    "scores": "'.$new_scores.'",
                    "message" : "Correct"
                }';
            }
            else {

                # Inserting the current value of the correct choices
                $correct_insert = mysqli_query( $conn, "INSERT into scores (score_id, player_id, correct, scores, game_id, tag_id, subject_id, session_key, timer) values ('', '$player_id', '$right', '$score', '$gid', '$tid','$sid', '$key', 0) " );

                echo '{
                    "success": true,
                    "value": 1,
                    "scores": 5,
                    "message" : "Correct"
                }';
            }
            # End of correct answer check

        } else {

            #Get the current value of the user's wrong answers
            $sql2 = mysqli_query($conn, "SELECT wrong from scores where player_id = '$player_id' and session_key = '$key' ");

            if ( mysqli_num_rows($sql2) == 1 ) {

                $row = mysqli_fetch_assoc($sql2);
                $wrong_value = $row['wrong'] ;

                $new_value = $wrong_value + 1;

                # Inserting the current value of the wrong choice
                $wrong_update = mysqli_query( $conn, "UPDATE scores set wrong = '$new_value' WHERE player_id = '$player_id' " );

                echo '{
                    "success": true,
                    "value": "'.$new_value.'",
                    "message" : "Wrong"
                }';
            }
            else {
                # Inserting the current value of the wrong choice
                $wrong_insert = mysqli_query( $conn, "INSERT into scores (score_id, player_id, wrong, game_id, tag_id, subject_id, session_key) values ('', '$player_id', '$wrong', '$gid', '$tid','$sid', '$key') " );

                echo '{
                    "success": true,
                    "value": 1,
                    "message" : "Wrong"
                }';
            }
        }

    } else {
        echo '{
            "message" : "nothing came"
        }';
    }
