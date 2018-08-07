<?php
/* 
    ============= THE BELOW CODE WILL GET THE GAME ACTIVITIES OF THE OPPONENT AND WOULD BE DISPLAYED ===================
    ========================================== IN THE VIEW ASYNCRONOUSLY ==============================================
 */
    # starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SESSION['uid'])) {

        # Dependency
        require '../db.php';

        # Session variables
        $uid = $_SESSION['uid'];
        $gid = $_SESSION['gid'];
        $tid = $_SESSION['tid'];
        $key = $_SESSION['key'];

        # Query
        $sql = mysqli_query($conn, "SELECT * from scores where session_key = '$key' and player_id != '$uid' ");

        if (mysqli_num_rows($sql) > 0) {
            $rows = mysqli_fetch_assoc($sql);

            # When the user is not the opponent
            if ($uid != $rows['player_id']) {

                $std = new stdClass();
                $std->opponent = $rows['player_id'];
                $std->o_correct = $rows['correct'];
                $std->o_wrong = $rows['wrong'];
                $std->o_scores = $rows['scores'];
                $std->o_questions = $rows['questions'];

                # Return result back to the view
                echo json_encode($std);
                exit();
                
            } else {
                echo '{
                    "success" : false,
                    "message" : "Sorry! Player 2 has not responded yet"
                }';
                exit();
            }
            

        } else {
            # No result
            echo '{
                "success" : false,
                "message" : "Sorry! There\'s nothing on the Scoreboard"
            }';
            exit();
        }
        
    }