<?php
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['questions_id']) && isset($_SESSION['subject_id'])) {
        
        # session variables
        $ques_id = $_SESSION['questions_id'];
        $sub_id = $_SESSION['subject_id'];
        $key = $_SESSION['key'];

        # Dependency
        require '../db.php';

        # Array
        // $list = array();

        # Standard Class
        $list = new stdClass();

        # Get questions
        $ques_get = mysqli_query($conn, "SELECT question_id from vQues where session_key = '$key' and subject_id = '$sub_id' order by id desc limit 1 ");

        if ( mysqli_num_rows($ques_get) == 1 ) {
            
            $rows = mysqli_fetch_assoc($ques_get);
            $question_id = $rows['question_id'];

            # Query the actual question
            $ques_query = mysqli_query($conn, "SELECT question from questions where questions_id = '$question_id' ");
            if (mysqli_num_rows($ques_query) == 1) {
                $ques_row = mysqli_fetch_assoc($ques_query);
                $question = $ques_row['question'];

                # Query to get answers
                $sql = mysqli_query($conn, "SELECT option_1, option_2, answer, option_3 from answers where question_id = '$question_id' and subject_id = '$sub_id'  ");

                if ( mysqli_num_rows($sql) == 1 ) {
                    
                    while ($rows = mysqli_fetch_assoc($sql)) {
                        // $list[] = $rows;
                        $list->option1 = $rows['option_1'];
                        $list->option2 = $rows['option_2'];
                        $list->option3 = $rows['answer'];
                        $list->option4 = $rows['option_3'];
                    }

                    // shuffle($list);

                    # return results
                    echo json_encode($list);
                }


            } else {
                echo '{
                    "success" : false,
                    "message" : "No questions came"
                }';
            }

            
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