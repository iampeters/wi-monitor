<?php
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['subject'])) {

        $id = $_SESSION['subject_id'];

        // Database parameters
        $dbname = 'wi-monitor';
        $dbuser = 'root';
        $dbpass = "";
        $dbhost = 'localhost';

        // Establish database connection
        $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

        if (!$conn->connect_error) {
            // $sql = "select * from questions where subject_id = $id  order by rand() limit 1";
            $sql = "select * from questions where subject_id = $id limit 1";
            $query = mysqli_query($conn, $sql);

            if (mysqli_num_rows($query) == 1) {
                $row = mysqli_fetch_assoc($query);
                $Qid = $row['questions_id'];
                $question = $row['question'];
                $answer = $row['correct_answer'];

                // getting available options
                $sql1 = "select * from answers where question_id = $Qid";
                $res = mysqli_query($conn, $sql1);

                if (mysqli_num_rows($res) == 1) {
                    $row1 = mysqli_fetch_assoc($res);

                    $option1 = $row1['option_1'];
                    $option2 = $row1['option_2'];
                    $option3 = $row1['option_3'];
                    $c_answer = $row1['correct_answer'];

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
            

        }

    } else {
        # code...
    }
    

?>