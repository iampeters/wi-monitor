<?php
// starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['subject'])) {
        
       # Get session variables
       $sid = $_SESSION['subject_id'];
       $key = $_SESSION['key'];
       $uid = $_SESSION['uid'];
       $username = $_SESSION['username'];

       # Dependencies
       require '../db.php';

       # Query
       $query = mysqli_query($conn, "SELECT * from questions where subject_id = '$sid' order by rand() limit 1");

       if (mysqli_num_rows($query) == 1) {
            $row = mysqli_fetch_assoc($query);
            $Qid = $row['questions_id'];
            $question = $row['question'];
            $answer = $row['answer'];

            # Adding quesions id to session
            $_SESSION['questions_id'] = $Qid;

            // getting available options
            $sql1 = "SELECT * from answers where question_id = $Qid";
            $res = mysqli_query($conn, $sql1);

            if (mysqli_num_rows($res) == 1) {
                $row1 = mysqli_fetch_assoc($res);

                $option1 = $row1['option_1'];
                $option2 = $row1['option_2'];
                $option3 = $row1['option_3'];
                $c_answer = $row1['answer'];

                # Inserting into vQues tbl
                $vQues = mysqli_query($conn, "INSERT INTO vQues values(null, '$sid', '$Qid', '$key') ");

                
                
                echo '{
                    "success": true,
                    "Qid": "'.$Qid.'",
                    "question": "'.$question.'"
                }';

            } else {
                # False
                echo '{
                    "success"" false,
                    "message": "A fatal error has occured"
                }';
            }

        } else {
            # No questions
            echo '{
                "success" : false,
                "message" : "Sorry! There are no questions yet"
            }';
        }

    } else {
        # False
        echo '{
            "success": false
        }';
    }


?>