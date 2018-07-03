<?php
    header('Access-control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    if (isset($_POST['question'])) {

        $question = $_POST['question'];
        $answer = $_POST['answer'];
        $subject_id = $_POST['subject'];
        $option1 = $_POST['option1'];
        $option2 = $_POST['option2'];
        $option3 = $_POST['option3'];

        // Establishing database connection
        require '../db.php';

        // Query
        $query = mysqli_query($conn, "insert into questions (subject_id, question, answer ) values('$subject_id', '$question', '$answer')");

        if ($query) {
           $query1 = mysqli_query($conn, "select questions_id from questions where question ='$question' ");

           if (mysqli_num_rows($query1) > 0)   {
                $row = mysqli_fetch_assoc($query1);
                $question_id = $row['questions_id'];

                $query2 = mysqli_query($conn, "insert into answers (subject_id, question_id, option_1, option_2, option_3, answer) values ('$subject_id','$question_id','$option1','$option2','$option3','$answer')");

                if ($query2) {
                      echo'{
                            "success": true,
                            "message": "Question successfully added"
                        }';
                } else {
                    echo'{
                            "success": false,
                            "message": "Error! Question could not be added at this time"
                        }';
                }
                
           } else {
                echo'{
                "success": false,
                "message": "Error! Could not get question id from server"
            }';
           }
           
        } 
        else {
            echo'{
                "success": false,
                "message": "Error! Question already exist on the server"
            }';
        }
        
    } 
    else {
         echo '{
            "success": false,
            "message": "Error! Please enter a subject to add"
        }';
    }
    
?>