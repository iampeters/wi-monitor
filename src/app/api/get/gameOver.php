<?php

    # Session
    session_start();

    # Header
    header('Access-Control-Allow-Origin: *');


    $uid = $_SESSION['uid'];
    $key = $_SESSION['key'];

        # Dependency
        require '../db.php';

        # Get tag
        $sql = mysqli_query($conn, "SELECT * from scores where session_key = '$key'");

        if ( mysqli_num_rows($sql) >  0 ) {
            while ($rows = mysqli_fetch_assoc($sql)) {

                if ($uid == $rows['player_id']) {
                    # code...
                    $player_id = $rows['player_id'];
                    // echo $player_id;
                    $p_scores = $rows['scores'];
                    // echo $p_scores. '<br>';;
                }
    
                if ($uid != $rows['player_id']) {
                    $opp = $rows['player_id'];
                    $o_scores = $rows['scores'];
                    // echo $opponent . '<br>';;
                    // echo $o_scores;
                }
            }

            $std = new stdClass();

            if ($o_scores > $p_scores) {
                $opponent = 'Win';

            } elseif ($o_scores == $p_scores) {
                $opponent = 'Draw';

            } else {
                $opponent =  'Lost';
            } 

            if ($o_scores < $p_scores) {
                $player = 'Win';

            } elseif ($o_scores == $p_scores) {
                $player = 'Draw';

            } else {
                $player = 'Lost';
            }

            $std->player = $player;
            $std->opponent = $opponent;

            echo json_encode($std);
            
            // mysqli_query($conn, "UPDATE tag set has_ended = 'true' where session_key = '$key' ");

            exit();

            
        } else {
            echo $message = 'Sorry! There are no games with that key';
        }

?>