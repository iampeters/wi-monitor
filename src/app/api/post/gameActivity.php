<?php
// starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);


    if (isset($_SESSION['parent']) && isset($_SESSION['game'])) {

        $key = $_SESSION['game'];

        # Dependencies
        require '../db.php';

        $sql = mysqli_query($conn, "SELECT * from tag where session_key = '$key' and has_ended = 'false' ");

        if (mysqli_num_rows($sql) == 1) {
            # rows
            $rows = mysqli_fetch_assoc($sql);
            $subject_id = $rows['subject_id'];
            $player = $rows['player_id'];
            $opponent = $rows['opponent_id'];
            $tag_id = $rows['tag_id'];

            $_SESSION['tag_id'] = $tag_id;
            $_SESSION['sub_id'] = $subject_id;

            # Getting player names
            $p_name = mysqli_query($conn, "SELECT * from users where user_id = '$player' ");
            $p_s_rows = mysqli_fetch_assoc($p_name);

            $p_username = $p_s_rows['username'];
            $p_fullname = $p_s_rows['fullname'];

            # Getting opponent names
            $o_name = mysqli_query($conn, "SELECT * from users where user_id = '$opponent' ");
            $o_s_rows = mysqli_fetch_assoc($o_name);

            $o_username = $o_s_rows['username'];
            $o_fullname = $o_s_rows['fullname'];

            # Getting subject
            $subj = mysqli_query($conn, "SELECT subject from Subjects where subject_id = '$subject_id' ");
            $subj_row = mysqli_fetch_assoc($subj);

            $subject = $subj_row['subject'];

            # Getting viewers
            $v_query = mysqli_query($conn, "SELECT viewers from game where session_key = '$key' ");
            $v_rows = mysqli_fetch_assoc($v_query);

            $viewers = $v_rows['viewers'];

            # Getting turns for player
            $turns_p_query = mysqli_query($conn, "SELECT is_player from turns where tag_id = '$tag_id' and player_id = '$player' ");
            $turns_p_rows = mysqli_fetch_assoc($turns_p_query);

            $p_turns = $turns_p_rows['is_player'];

            # Getting turns for opponent
            $turns_o_query = mysqli_query($conn, "SELECT is_player from turns where tag_id = '$tag_id' and player_id = '$opponent' ");
            $turns_o_rows = mysqli_fetch_assoc($turns_o_query);

            $o_turns = $turns_o_rows['is_player'];

            # Getting the scores for player
            $player_query = mysqli_query($conn, "SELECT * from scores where player_id = '$player' and session_key = '$key' ");

            if (mysqli_num_rows($player_query) == 1) {
                # Player rows
                $p_rows = mysqli_fetch_assoc($player_query);

                $correct = $p_rows['correct'];
                $wrong = $p_rows['wrong'];
                $scores = $p_rows['scores'];
                $p_ques = $p_rows['questions'];


            } else {
                $correct = 0;
                $wrong = 0;
                $scores = 0;
                $p_ques = "";

            }

            # Getting the scores for opponent
            $opponent_query = mysqli_query($conn, "SELECT * from scores where player_id = '$opponent' and session_key = '$key' ");

            if (mysqli_num_rows($opponent_query) == 1) {
                # Player rows
                $o_rows = mysqli_fetch_assoc($opponent_query);

                $o_correct = $o_rows['correct'];
                $o_wrong = $o_rows['wrong'];
                $o_scores = $o_rows['scores'];
                $o_ques = $o_rows['questions'];

            } else {
                $o_correct = 0;
                $o_wrong = 0;
                $o_scores = 0;
                $o_ques = "";
            }

            # Return result
            $std = new stdClass();

            $std->success = true;
            $std->player = $player;
            $std->opponent = $opponent;
            $std->p_scores = $scores;
            $std->p_correct = $correct;
            $std->p_wrong = $wrong;
            $std->o_scores = $o_scores;
            $std->o_correct = $o_correct;
            $std->o_wrong = $o_wrong;
            $std->p_username = $p_username;
            $std->o_username = $o_username;
            $std->subject = $subject;
            $std->p_fullname = $p_fullname;
            $std->o_fullname = $o_fullname;
            $std->viewers = $viewers;
            $std->p_count = $p_ques;
            $std->o_count = $o_ques;
            $std->p_turn = $p_turns;
            $std->o_turn = $o_turns;


            echo json_encode($std);
            

        } else {
            # Return error
            echo '{
                "success" : false,
                "message" : "Sorry! No tags to display"
            }';
        }
        

    } else {
        echo '{
            "success" : false,
            "message" : "Hey! Are you sure you wanna do this?"
        }';
    }

?>