<?php
// starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['subject'])) {
        $sid = $_SESSION['subject_id'];

        require '../db.php';

        $ques = array();

       $query = mysqli_query($conn, "select * from questions where subject_id = '$sid' order by rand() limit 1");

       if (mysqli_num_rows($query) == 1) {
                $row = mysqli_fetch_assoc($query);
                $Qid = $row['questions_id'];
                $question = $row['question'];
                $answer = $row['answer'];

                // getting available options
                $sql1 = "select * from answers where question_id = $Qid";
                $res = mysqli_query($conn, $sql1);

                if (mysqli_num_rows($res) == 1) {
                    $row1 = mysqli_fetch_assoc($res);

                    $option1 = $row1['option_1'];
                    $option2 = $row1['option_2'];
                    $option3 = $row1['option_3'];
                    $c_answer = $row1['answer'];

                    echo '{
                        "success": true,
                        "Qid": "'.$Qid.'",
                        "question": "'.$question.'",
                        "option1": "'.$option1.'",
                        "option2": "'.$option2.'",
                        "option3": "'.$option3.'",
                        "answer": "'.$c_answer.'"
                    }';

                } else {
                    echo '{
                        "success"" false,
                        "message": "A fatal error has occured"
                    }';
                }

            } else {
                # code...
            }

    } else {
        echo '{
            "success": false
        }';
    }


?>