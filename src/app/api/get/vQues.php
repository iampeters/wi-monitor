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

        # Query for player 1 questions
        $p_sql = mysqli_query($conn, "SELECT * from vQues where session_key = '$key' and user_id = '$player' order by id desc limit 1 ");
        $p_rows = mysqli_fetch_assoc($p_sql);
        $p_qid = $p_rows['question_id'];
        
        # Get the actual question
        $p_getQuestion = mysqli_query($conn, "SELECT question from questions where questions_id = '$p_qid' ");
        $p_ques_row = mysqli_fetch_assoc($p_getQuestion);
        $p_question = $p_ques_row['question'];

        # Get the answers
        $p_getAns = mysqli_query($conn, "SELECT * from answers where question_id = '$p_qid' ");
        $p_ans_rows = mysqli_fetch_assoc($p_getAns);
        $p_option_1 = $p_ans_rows['option_1'];
        $p_option_2 = $p_ans_rows['option_2'];
        $p_option_3 = $p_ans_rows['option_3'];
        $p_answer = $p_ans_rows['answer'];

         # Query for opponent questions
        $o_sql = mysqli_query($conn, "SELECT * from vQues where session_key = '$key' and user_id = '$opponent' order by id desc limit 1 ");
        $o_rows = mysqli_fetch_assoc($o_sql);
        $o_qid = $o_rows['question_id'];
        
        # Get the actual question
        $o_getQuestion = mysqli_query($conn, "SELECT question from questions where questions_id = '$o_qid' ");
        $o_ques_row = mysqli_fetch_assoc($o_getQuestion);
        $o_question = $o_ques_row['question'];

        # Get the answers
        $o_getAns = mysqli_query($conn, "SELECT * from answers where question_id = '$o_qid' ");
        $o_ans_rows = mysqli_fetch_assoc($o_getAns);
        $o_option_1 = $o_ans_rows['option_1'];
        $o_option_2 = $o_ans_rows['option_2'];
        $o_option_3 = $o_ans_rows['option_3'];
        $o_answer = $o_ans_rows['answer'];

        # Standard class where all our value will live       
        $std = new stdClass();
        
        # player
        $std->success = true;
        $std->p_question = $p_question;
        $std->p_option_1 = $p_option_1;
        $std->p_option_2 = $p_option_2;
        $std->p_option_3 = $p_option_3;
        $std->p_answer = $p_answer;
        
        # Opponent
        $std->o_question = $o_question;
        $std->o_option_1 = $o_option_1;
        $std->o_option_2 = $o_option_2;
        $std->o_option_3 = $o_option_3;
        $std->o_answer = $o_answer;

        # Return values in json format
        echo json_encode($std);

    } else {
        # No logged in parent
        echo '{
            "success" : false,
            "message" : "Hey! Are you sure you wanna do this?"
        }';
    }
    