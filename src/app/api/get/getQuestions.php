<?php
    // starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");


    if (isset($_SESSION['subject'])) {

        $id = $_SESSION['subject_id'];
        $key = $_SESSION['key'];
        $uid = $_SESSION['uid'];
        $username = $_SESSION['username'];

        // Database parameters
        $dbname = 'wi-monitor';
        $dbuser = 'root';
        $dbpass = "";
        $dbhost = 'localhost';

        // Establish database connection
        $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

        if (!$conn->connect_error) {

            // get subject id
            $sql = "SELECT * from questions where subject_id = $id  order by rand() limit 1";

            $query = mysqli_query($conn, $sql);

            if (mysqli_num_rows($query) == 1) {
                $row = mysqli_fetch_assoc($query);
                $Qid = $row['questions_id'];
                $question = $row['question'];
                $answer = $row['answer'];

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
                    $vQues = mysqli_query($conn, "INSERT INTO vQues values(null, '$id', '$Qid', '$key') ");

                    $_SESSION['questions_id'] = $Qid;

                    echo '{
                        "success" : true
                    }';

                    exit();
                } else {
                    echo '{
                        "success": false,
                        "message": "A fatal error has occured"
                    }';
                    exit();
                }

            } else {
                echo '{
                    "success": false,
                    "message": "There are no questions to display"
                }';
                exit();
            }


        }

    } else {
        echo '{
            "success": false,
            "message": "You have to SELECT a subject first"
        }';
        exit();
    }


?>
