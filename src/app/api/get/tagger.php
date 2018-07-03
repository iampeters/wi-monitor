<?php
    # starting session
    session_start();


    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    # Dependencies
    require '../db.php';

    if (isset($_SESSION['username']) && isset($_SESSION['subject_id'])) {

        # Storing session variables
        $logged_in_user_id = $_SESSION['uid'];
        $username = $_SESSION['username'];
        $subject_id = $_SESSION['subject_id'];
        $subject = $_SESSION['subject'];

        # Query the database
        $query = mysqli_query($conn, "select * from tag where subject_id = 'subject_id' and has_ended = false ");
        if (mysqli_num_rows($query) > 0) {
            $rows = mysqli_fetch_assoc($query);
            $tag_id = $rows['tag_id'];
            $tag_session_key = $rows['tag_session_key'];
            $opponent = $rows['opponent'];
            $tbl_user_id = $rows['player_id'];

            # Checks if logged in user is not the player_id in the database and the opponent field is empty
            if (($logged_in_user_id != $tbl_user_id) && empty($opponent)) {

                # Add logged in user as an opponent
                $query1 = mysqli_query($conn, "insert into tag (opponent_id) values ('$logged_in_user_id')");

                # Is there an error?
                if (!$query1) {
                    echo '{
                        "success": false,
                        "message": "Opponent failed to add"
                    }';
                }
                else {
                    # We will return some values
                }

            } else {
                # code...
            }
            



            # Adding opponent details

            
        } else {
            # This code will add a new tag with the session subject id
            $insert_tag = mysqli_query($conn, "insert into tag (tag_id, player_id, subject_id, tag_session_key) values ('', '$logged_in_user_id', '$subject_id', '$tag_session_key') ");

            # Is there an error?
            if (!$insert_tag) {
                echo '{
                    "success": false,
                    "message": "Failed to add a new tag"
                }';
            }
            else {
                #We will return some value
            }
        }
        

        
        
    } else {
        # code...
    }
    

?>