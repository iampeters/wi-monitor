<?php
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['subject_id'])) {
        
        # session variables
        $ques_id = $_SESSION['questions_id'];
        $sub_id = $_SESSION['subject_id'];
        $key = $_SESSION['key'];

        # Dependency
        require '../db.php';

        # listay
        $list = new stdClass();

        # Query
        $sql = mysqli_query($conn, "SELECT question_id from vQues where session_key = '$key' and subject_id = '$sub_id' order by id desc limit 1 ");

        if ( mysqli_num_rows($sql) == 1 ) {
            
            $rows = mysqli_fetch_assoc($sql);
            $question_id = $rows['question_id'];
            $_SESSION['questions_id'] = $question_id;

            # Query the actual question
            $ques_query = mysqli_query($conn, "SELECT question from questions where questions_id = '$question_id' ");
            if (mysqli_num_rows($ques_query) == 1) {
                $ques_row = mysqli_fetch_assoc($ques_query);
                $question = $ques_row['question'];
            }

            # return results
            echo '{
                "success" : true,
                "question" : "'.$question.'",
                "question_id" : "'.$question_id.'"
            }';
        } else {
            echo '{
                "question" : "I didnt get anything"
            }';
        }
        
    } else {
        echo '{
            "success" : false
        }';
    }