<?php
    # starting session
    session_start();


    header('Access-Control-Allow-Origin: *');
    // header("Content-Type: application/json; charset=UTF-8");

   

    // if (isset($_SESSION['username']) && isset($_SESSION['subject_id'])) {


        # Dependencies
        require '../db.php';

        # Storing session variables
        // $logged_in_user_id = $_SESSION['uid'];
        // $username = $_SESSION['username'];
        // $sud_id = $_SESSION['subject_id'];
        // $subject = $_SESSION['subject'];
        // $rand = 'gid_'.rand(000000, 999999);

        # Check if there are existing games with the subject_id
        $query_tag = mysqli_query($conn, "SELECT * from tag where subject_id = 13 and has_ended = 'false' and is_merged = 0 ");
        if (mysqli_num_rows($query_tag) > 0) {
            $tag_rows = mysqli_fetch_assoc($query_tag);

            $opponent = $tag_rows['opponent_id'];
            $player_id = $tag_rows['player_id'];

            if(empty($opponent)) {
                echo "empty".'<br>';
            }
            else {
                echo 'not empty'.'<br>';
            }

            if ($player_id == 9) {
                # code...
                echo 'player id equals 4'.'<br/>';
            } else {
                echo 'player id !equals 4'.'<br>';
            }
            




        } else {
            # This means there are no games with that the subject id.
            # we will initialize a new game
        }



    // } else {
    //     echo '{
    //         "success" : false,
    //         "message" : "You must login first"
    //     }';
    // }