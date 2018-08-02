<?php
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['questions_id']) && isset($_SESSION['subject_id'])) {
        
        # session variables
        $ques_id = $_SESSION['questions_id'];
        $sub_id = $_SESSION['subject_id'];

        # Dependency
        require '../db.php';

        # listay
        $list = array();

        # Query
        $sql = mysqli_query($conn, "SELECT option_1, option_2, answer, option_3 from answers where question_id = '$ques_id' and subject_id = '$sub_id'  ");

        if ( mysqli_num_rows($sql) == 1 ) {
            
            while ($rows = mysqli_fetch_assoc($sql)) {
                // $list[] = $rows;
                $list[0]['answer'] = $rows['option_1'];
                $list[1]['answer'] = $rows['option_2'];
                $list[2]['answer'] = $rows['answer'];
                $list[3]['answer'] = $rows['option_3'];
            }

            // shuffle($list);

            # return results
            echo json_encode($list);
        }
        
    } else {
        echo '{
            "success" : false
        }';
    }