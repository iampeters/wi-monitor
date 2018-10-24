<?php

    # Session
    session_start();

    # Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json; charset=UTF-8');

    # Check if there is a session
    if (isset($_SESSION['player']) && isset($_SESSION['game'])) {

        # Dependencies
        require '../db.php';

        # Variables from session
        $key = $_SESSION['game'];
        $player = $_SESSION['player'];
        $opponent = $_SESSION['opponent'];

        # Query for questions from vQues tbl
        $sql = mysqli_query($conn, "SELECT * from vQues where session_key = '$key' order by id desc limit 1 ");
        $rows = mysqli_fetch_assoc($sql);
        $qid = $rows['question_id'];
        $sid = $rows['subject_id'];

        # Get the actual question
        $getQuestion = mysqli_query($conn, "SELECT question from questions where questions_id = '$qid' ");
        $ques_row = mysqli_fetch_assoc($getQuestion);
        $question = $ques_row['question'];

        # Get the answers
        $getAns = mysqli_query($conn, "SELECT * from answers where question_id = '$qid' ");
        $ans_rows = mysqli_fetch_assoc($getAns);
        // $option_1 = $ans_rows['option_1'];
        // $option_2 = $ans_rows['option_2'];
        // $option_3 = $ans_rows['option_3'];
        $answer = $ans_rows['answer'];

        # Session
        $_SESSION['questions_id'] = $qid;
        $_SESSION['subject_id'] = $sid;


        # Standard class where all our value will live
        $std = new stdClass();

        # player
        $std->success = true;
        $std->question = $question;
        // $std->option_1 = $option_1;
        // $std->option_2 = $option_2;
        // $std->option_3 = $option_3;
        $std->answer = $answer;


        # Return values in json format
        echo json_encode($std);

    } else {
        # No logged in parent
        echo '{
            "success" : false,
            "message" : "Hey! Are you sure you wanna do this?"
        }';
    }
