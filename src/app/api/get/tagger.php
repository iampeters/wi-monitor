<?php
    # starting session
    session_start();


    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

   

    if (isset($_SESSION['username']) && isset($_SESSION['subject_id'])) {

        # Dependencies
        require '../db.php';

        # Storing session variables
        $logged_in_user_id = $_SESSION['uid'];
        $username = $_SESSION['username'];
        $subject_id = $_SESSION['subject_id'];
        $subject = $_SESSION['subject'];
        $rand = 'gid_'.rand(0000, 9999);

        # Query the database
        $query = mysqli_query($conn, "select * from tag where subject_id = '$subject_id' and has_ended = false ");
        if (mysqli_num_rows($query) > 0) {
            $rows = mysqli_fetch_assoc($query);
            $tag_id = $rows['tag_id'];
            $tag_session_key = $rows['session_key'];
            $opponent = $rows['opponent_id'];
            $tag_user_id = $rows['player_id'];
            $has_ended = $rows['has_ended'];

            # Checks if logged in user is not the player_id in the database and the opponent field is empty
            if (($logged_in_user_id != $tag_user_id && !empty($tag_user_id)) && empty($opponent)) {

                # Add logged in user as an opponent
                $query1 = mysqli_query($conn, "update tag set opponent_id = '$logged_in_user_id', session_key = '$rand' ");

                # Is there an error?
                if (!$query1) {

                    echo '{
                        "success": false,
                        "message": "Opponent failed to add"
                    }';
                }
                else {          

                    # Insert into the game table and intialize the game
                    $insert_game = mysqli_query($conn, "insert into game (game_id, subject_id, session_key, has_ended) values ('', '$subject_id', '$rand', '0')");

                    if ( !$insert_game ) {

                        echo '{
                            "success": false,
                            "message": "Game could not be initialized"
                        }';
                    }

                    # Getting back the details of the players
                    $select_tag = mysqli_query($conn, "select * from tag as T, game as G where T.session_key = G.session_key and T.subject_id = G.subject_id");

                    # Checking for results
                    if ( mysqli_num_rows( $select_tag ) > 0) {

                        # save the returned array to a variable
                        $rows = mysqli_fetch_assoc( $select_tag );

                        # Getting username of players from users table
                        $select_users = mysqli_query($conn, "select username, fullname from users where user_id = " . $rows['player_id'] ."");

                        if ( mysqli_num_rows($select_users) > 0 ) {
                            $player_row = mysqli_fetch_assoc($select_users);
                        }

                        # Getting username of players from users table
                         $select_users2 = mysqli_query($conn, "select username, fullname from users where user_id = ".$rows['opponent_id']."");

                        if ( mysqli_num_rows($select_users2) > 0 ) {
                            $opponent_row = mysqli_fetch_assoc($select_users2);
                        }

                        # Create a standard class
                        $data = new stdClass();

                        $data->game_id = $rows['game_id'];
                        $data->tag_id = $rows['tag_id'];
                        $data->subject_id = $rows['subject_id'];
                        $data->subject = $_SESSION['subject'];
                        $data->player_id = $rows['player_id'];
                        $data->opponent_id = $rows['opponent_id'];
                        $data->session_key = $rows['session_key'];
                        $data->player_name = $player_row['username'];
                        $data->opponent_name = $opponent_row['username'];
                        $data->loggedInUser = $username;
                        $data->success = true;
                        $data->message = "start";

                        # Add to session variables
                        $_SESSION['gid'] = $rows['game_id'];
                        $_SESSION['tid'] = $rows['tag_id'];
                        $_SESSION['key'] = $rows['session_key'];

                        $gid = $rows['game_id'];
                        $tid = $rows['tag_id'];
                        $key = $rows['session_key'];

                        # Send back data
                        echo json_encode($data);

                    } else {

                        echo '{
                            "success": false
                        }';
                    }
                    
                }

            } elseif (($logged_in_user_id == $tag_user_id ) && empty($opponent)) {

                echo '{
                    "message" : "Waiting for opponent to join the game",
                    "username" : "'.$username.'",
                    "subject" : "'.$subject.'"
                }';
            }
            elseif ( ($logged_in_user_id == $tag_user_id || $logged_in_user_id == $opponent ) && $has_ended == 'false' ) {

                # Get all player details and resume the game.
                    $select_tag = mysqli_query($conn, "select * from tag as T, game as G where T.session_key = G.session_key and T.subject_id = G.subject_id");

                    # Checking for results
                    if ( mysqli_num_rows( $select_tag ) > 0) {

                        # save the returned array to a variable
                        $rows = mysqli_fetch_assoc( $select_tag );

                        # Getting username of players from users table
                        $select_users = mysqli_query($conn, "select username, fullname from users where user_id = " . $rows['player_id'] ."");

                        if ( mysqli_num_rows($select_users) > 0 ) {
                            $player_row = mysqli_fetch_assoc($select_users);
                        }

                        # Getting username of players from users table
                         $select_users2 = mysqli_query($conn, "select username, fullname from users where user_id = ".$rows['opponent_id']."");

                        if ( mysqli_num_rows($select_users2) > 0 ) {
                            $opponent_row = mysqli_fetch_assoc($select_users2);
                        }

                        # Create a standard class
                        $data = new stdClass();

                        $data->game_id = $rows['game_id'];
                        $data->tag_id = $rows['tag_id'];
                        $data->subject_id = $rows['subject_id'];
                        $data->subject = $_SESSION['subject'];
                        $data->player_id = $rows['player_id'];
                        $data->opponent_id = $rows['opponent_id'];
                        $data->session_key = $rows['session_key'];
                        $data->player_name = $player_row['username'];
                        $data->opponent_name = $opponent_row['username'];
                        $data->loggedInUser = $username;
                        $data->success = true;
                        $data->message = "resume";

                        # Add to session variables
                        $_SESSION['gid'] = $rows['game_id'];
                        $_SESSION['tid'] = $rows['tag_id'];
                        $_SESSION['key'] = $rows['session_key'];

                        echo json_encode($data);
                    }
                
            } else {

                # This means the game is either ongoing or hasEnded
                # A new game of the same subject would be created

                $insert_tagg = mysqli_query($conn, "insert into tag (tag_id, player_id, subject_id, session_key) values ('', '$logged_in_user_id', '$subject_id', '') ");

                # Is there an error?
                if (!$insert_tagg) {

                    echo '{
                        "success": false,
                        "message": "Failed to add a new tag"
                    }';
                }
                else {

                    # We will return some value
                    echo '{
                        "success" : true,
                        "message": "New tag created! Waiting for Opponent to join the game",
                        "username" : "'.$username.'",
                        "subject" : "'.$subject.'"
                    }';

                }
                // echo '{
                //     "message" : "Error",
                //     "success": false
                // }';
            }
            
        } else {

            # This code will add a new tag with the session subject id
            # if there is no tag with the subject_id
            $insert_tag = mysqli_query($conn, "insert into tag (tag_id, player_id, subject_id, session_key) values ('', '$logged_in_user_id', '$subject_id', '') ");

            # Is there an error?
            if (!$insert_tag) {

                echo '{
                    "success": false,
                    "message": "Failed to add a new tag"
                }';
            }
            else {

                # We will return some value
                echo '{
                    "success": true,
                    "message": "New tag created!",
                    "username" : "'.$username.'",
                    "subject" : "'.$subject.'"
                }';
            }
        }
        

        
        
    }
    

?>