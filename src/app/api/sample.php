<?php
    session_start();

    // header('Access-Control-Allow-Origin: *');
    // header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    
    if(isset($_POST['id'])) {
        $key = $_POST['id'];

        # Dependency
        require 'db.php';

        # Get tag
        $sql = mysqli_query($conn, "SELECT * from tag where session_key = '$key' and has_ended = 'false' ");

        if ( mysqli_num_rows($sql) == 1 ) {
            $rows = mysqli_fetch_assoc($sql);

            $player_id = $rows['player_id'];
            $opponent_id = $rows['opponent_id'];
            $subject_id = $rows['subject_id'];
            $tag_id = $rows['tag_id'];

        } else {
            echo $message = 'Sorry! There are no games with that key';
            exit();
        }

        # Get question id
        $getQuestionId = mysqli_query($conn, "SELECT * FROM vQues WHERE session_key = '$key' and subject_id = '$subject_id'  order by id desc limit 1");
        $ques_row = mysqli_fetch_assoc($getQuestionId);
        $question_id = $ques_row['question_id'];

        # Get questions
        $getQuestion = mysqli_query($conn, "SELECT * from questions where questions_id = '$question_id' and subject_id = '$subject_id' ");
        $ques_rows = mysqli_fetch_assoc($getQuestion);
        $answer = $ques_rows['answer'];
        $question = $ques_rows['question'];

        # Get player 1 fullname
        $getPlayer1 = mysqli_query($conn, "select fullname from users where user_id = '$player_id' ");
        $player_row = mysqli_fetch_assoc($getPlayer1);
        $p_name = $player_row['fullname'];

        # Get player 2 fullname
        $getPlayer2 = mysqli_query($conn, "select fullname from users where user_id = '$opponent_id' ");
        $player2_row = mysqli_fetch_assoc($getPlayer2);
        $p2_name = $player2_row['fullname'];

        # Get answers
        $ans = mysqli_query($conn, "select * from answers where question_id = '$question_id' ");
        
        $arr = array();
       

        # Get subjects
        $sub = mysqli_query($conn, "select subject from Subjects where subject_id = '$subject_id' ");
        $sub_row = mysqli_fetch_assoc($sub);
        $subject = $sub_row['subject'];

        # Get Scores for player 1
        $score = mysqli_query($conn, "select * from scores where session_key = '$key' and player_id = '$player_id' ");
        $score_row = mysqli_fetch_assoc($score);
        $correct = $score_row['correct'];
        $wrong = $score_row['wrong'];
        $scores = $score_row['scores'];
        $questions = $score_row['questions'];

        # Get Scores for player 1
        $o_score = mysqli_query($conn, "select * from scores where session_key = '$key' and player_id = '$opponent_id' ");
        $o_score_row = mysqli_fetch_assoc($o_score);
        $o_correct = $o_score_row['correct'];
        $o_wrong = $o_score_row['wrong'];
        $o_scores = $o_score_row['scores'];
        $o_questions = $o_score_row['questions'];

        # Get player 1 turn from turns tbl
        $p1 = mysqli_query($conn, "SELECT is_player from turns where tag_id = '$tag_id' and player_id = '$player_id' ");
        $p1_row = mysqli_fetch_assoc($p1);
        $p1turn = $p1_row['is_player'];

        # Get player 2 turn from turns tbl
        $p2 = mysqli_query($conn, "SELECT is_player from turns where tag_id = '$tag_id' and player_id = '$opponent_id' ");
        $p2_row = mysqli_fetch_assoc($p2);
        $p2turn = $p2_row['is_player'];
        
        # Get viewers from game tbl
        $viewers = mysqli_query($conn, "SELECT viewers from game where session_key = '$key' ");
        $v_row = mysqli_fetch_assoc($viewers);
        $v_count = $v_row['viewers'];

        $std = new stdClass();
        $std->o_scores = $o_score_row['scores'];
        $std->o_wrong = $o_score_row['wrong'];
        $std->o_correct = $o_score_row['correct'];
        $std->scores = $score_row['scores'];
        $std->wrong = $score_row['wrong'];
        $std->correct = $score_row['correct'];
        $std->subject = $sub_row['subject'];
        $std->p2_name = $player2_row['fullname'];
        $std->p_name = $player_row['fullname'];
        $std->question = $ques_rows['question'];
        $std->p_question = $questions;
        $std->o_question = $o_questions;
        $std->p1_turn = $p1turn;
        $std->p2_turn = $p2turn;
        $std->viewers = $v_count;

        # session variable
        $_SESSION['QID'] = $question_id;
        $_SESSION['wid'] = $player_id;
        $_SESSION['game'] = $key;
        
        # Return class as json
        echo json_encode($std);







    } else {
        echo 'Nothing came';
    }
    