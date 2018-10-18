<?php
    # starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    // $_SESSION['subject_id'] = 3;
    // $_SESSION['username'] = 'iampeters';

    if (isset($_SESSION['username']) && isset($_SESSION['subject_id'])) {

        # Dependencies
        require '../db.php';
        // require '../../../../socket/Db/Database.php';


        # Storing session variables
        $logged_in_user_id = $_SESSION['uid'];
        $username = $_SESSION['username'];
        $subject_id = $_SESSION['subject_id'];
        $subject = $_SESSION['subject'] = 'Current Affairs';
        $rand = 'gid_'.rand(000000, 999999);

        # Query the database to check for games with the subject id
        $query = mysqli_query($conn, "SELECT * from tag where subject_id = '$subject_id' and has_ended = 'false' and is_merged = 0");
        if (mysqli_num_rows($query) > 0) {

            while ($rows = mysqli_fetch_assoc($query)) {

                $tag_id = $rows['tag_id'];
                $tag_session_key = $rows['session_key'];
                $opponent = $rows['opponent_id'];
                $tag_user_id = $rows['player_id'];
                $has_ended = $rows['has_ended'];
                $isMerged = $rows['is_merged'];
            }


            # Checks if logged in user is not the player_id in the database and the opponent field is empty
            if ( empty($opponent) && $logged_in_user_id != $tag_user_id  ) {

                # Add logged in user as an opponent
                $query1 = mysqli_query($conn, "UPDATE tag set opponent_id = '$logged_in_user_id', session_key = '$rand', is_merged = 1  where subject_id = '$subject_id' and has_ended = 'false' and is_merged = 0 ");

                # Is there an error?
                if (!$query1) {

                    echo '{
                        "success": false,
                        "message": "Opponent failed to add"
                    }';
                    exit();
                } else {
                    # Insert into the game table and intialize the game
                    $insert_game = mysqli_query($conn, "INSERT into game (game_id, subject_id, tag_id, session_key, has_ended, is_merged) values ('', '$subject_id', '$tag_id', '$rand', 0, 1)");

                    if ( !$insert_game ) {

                        echo '{
                            "success": false,
                            "message": "Game could not be initialized"
                        }';
                        exit();
                    }

                    # Getting back the details of the players
                    $select_tag = mysqli_query($conn, "SELECT * from tag where session_key = '$rand' and has_ended = 'false' and is_merged = 1 ");

                    # Checking for results
                    if ( mysqli_num_rows( $select_tag ) > 0) {

                        # save the returned array to a variable
                        $rows = mysqli_fetch_assoc( $select_tag );
                        $tag_key = $rows['session_key'];
                        $tag_id = $rows['tag_id'];
                        $o_id = $rows['opponent_id'];

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
                        

                        # Getting the game id
                        $game_query = mysqli_query($conn, "SELECT * from game where session_key = '$tag_key' and is_merged = 1 and has_ended = 0 ");
                        if (mysqli_num_rows($game_query) > 0) {
                            $game_rows = mysqli_fetch_assoc($game_query);

                        } else {
                            # Error
                            echo '{
                                "success" : false,
                                "message" : "Sorry! Could not get the game"
                            }';
                         exit();
                        }
                        


                        # Making sure user doesn't already exist
                        $turn_chk = mysqli_query($conn, "select * from turns where tag_id = '$tag_id' and player_id = '$o_id' ");

                        if ( mysqli_num_rows($turn_chk ) == 0) {

                            # Inserting in to the turn table
                            $turn_insert = mysqli_query($conn, "insert into turns (player_id, is_player, tag_id) values ('$o_id', '0', '$tag_id') ");

                            if (!$turn_insert) {
                                echo '{
                                    "success" : false,
                                    "message": "Could not insert into Turn tbl"
                                }';
                            }

                        }


                        # Create a standard class
                        $data = new stdClass();

                        $data->game_id = $game_rows['game_id'];
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
                        $_SESSION['gid'] = $game_rows['game_id'];
                        $_SESSION['tid'] = $rows['tag_id'];
                        $_SESSION['key'] = $rows['session_key'];

                        $gid = $game_rows['game_id'];
                        $tid = $rows['tag_id'];
                        $key = $rows['session_key'];

                        # Send back data
                        echo json_encode($data);


                        exit();

                    } else {

                        echo '{
                            "success": false,
                            "message" : "Could not get tag back"
                        }';
                        exit();
                    }
                    
                }

            } 
            elseif ($logged_in_user_id == $tag_user_id  && empty($opponent)) {

                echo '{
                    "message" : "Waiting for opponent to join the game",
                    "username" : "'.$username.'",
                    "subject" : "'.$subject.'"
                }';

                exit();
            }
            else {
                # This means the game is ongoing
                # A new game of the same subject would be created

                $insert_tagg = mysqli_query($conn, "INSERT into tag (tag_id, player_id, subject_id, session_key) values ('', '$logged_in_user_id', '$subject_id', '') ");

                # Is there an error?
                if (!$insert_tagg) {

                    echo '{
                        "success": false,
                        "message": "Failed to add a new tag"
                    }';
                    exit();
                }
                else {

                    # Getting back the tag
                    $get_tag = mysqli_query($conn, "select * from tag where player_id = '$logged_in_user_id' and subject_id = '$subject_id' and has_ended = 'false' limit 1 ");

                    if (mysqli_num_rows($get_tag) == 1) {
                        $get_rows = mysqli_fetch_assoc($get_tag);
                        $tid = $get_rows['tag_id'];
                    }
                    

                    # Making sure user doesn't already exist
                    $turn_chk = mysqli_query($conn, "select * from turns where tag_id = '$tid' and player_id = '$logged_in_user_id'");

                    if ( mysqli_num_rows($turn_chk ) == 0) {

                        # Inserting in to the turn table
                         $turn_insert = mysqli_query($conn, "insert into turns (player_id, is_player, tag_id) values ('$logged_in_user_id', '1', '$tid') ");

                        if (!$turn_insert) {
                            echo '{
                                "success" : false,
                                "message": "Could not insert into Turn tbl"
                            }';
                        }

                    }

                    # We will return some value
                    echo '{
                        "success" : true,
                        "message": "New tag created! Waiting for Opponent to join the game",
                        "username" : "'.$username.'",
                        "subject" : "'.$subject.'"
                    }';

                }

                exit();
            }
            
        } 
        
        # Query the database for merged users
        $query_isMerged = mysqli_query($conn, "SELECT * from tag where subject_id = '$subject_id' and ( player_id = '$logged_in_user_id' OR opponent_id = '$logged_in_user_id' ) and has_ended = 'false' and is_merged = 1 ");

        if (mysqli_num_rows($query_isMerged) > 0) {

            $tag_rows = mysqli_fetch_assoc($query_isMerged);
            $tagID = $tag_rows['tag_id'];
            
            # Out the values to the user
            # Get all player details and resume the game.
            $select_tag = mysqli_query($conn, "SELECT * from tag as T, game as G where (T.tag_id = '".$tagID."' and G.tag_id = '".$tagID."') and T.subject_id = G.subject_id");

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

                $o_id = $rows['opponent_id'];
                $tag_id = $rows['tag_id'];
                $game_id = $rows['game_id'];

                # Making sure user doesn't already exist
                $turn_chk = mysqli_query($conn, "select * from turns where tag_id = '$tag_id' and player_id = '$o_id' ");

                if ( mysqli_num_rows($turn_chk ) == 0) {

                    # Inserting in to the turn table
                    $turn_insert = mysqli_query($conn, "insert into turns (player_id, is_player, tag_id) values ('$o_id', '0', '$tag_id') ");

                    if (!$turn_insert) {
                        echo '{
                            "success" : false,
                            "message": "Could not insert into Turn tbl"
                        }';
                    }

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
                exit();
            } else {
                echo '{
                    "success" : false,
                    "message" : "Sorry! Could not get any match"
                }';
            }

        } else {
            # This code will add a new tag with the session subject id
            # if there is no tag with the subject_id
            $insert_tag = mysqli_query($conn, "INSERT into tag (player_id, subject_id) values ('$logged_in_user_id', '$subject_id') ");

            # Is there an error?
            if (!$insert_tag) {

                echo '{
                    "success": false,
                    "message": "Failed to add a new tag"
                }';

                exit();

            }
            else {

                # Getting back the tag
                $get_tag = mysqli_query($conn, "select * from tag where player_id = '$logged_in_user_id' and subject_id = '$subject_id' and has_ended = 'false' limit 1 ");

                if (mysqli_num_rows($get_tag) == 1) {
                    $get_rows = mysqli_fetch_assoc($get_tag);
                    $tid = $get_rows['tag_id'];
                }

                 # Making sure user doesn't already exist
                $turn_chk = mysqli_query($conn, "select * from turns where tag_id = '$tid' and player_id = '$logged_in_user_id' ");

                if ( mysqli_num_rows($turn_chk ) == 0) {

                    # Inserting in to the turn table
                        $turn_insert = mysqli_query($conn, "insert into turns (player_id, is_player, tag_id) values ('$logged_in_user_id', '1', '$tid') ");

                    if (!$turn_insert) {
                        echo '{
                            "success" : false,
                            "message": "Could not insert into Turn tbl"
                        }';
                    }

                }

                # We will return some value
                echo '{
                    "success": true,
                    "message": "New tag created!",
                    "username" : "'.$username.'",
                    "subject" : "'.$subject.'"
                }';
            }
            exit();
        }

    } else {
        echo '{
            "success" : false,
            "message" : "You must be logged in first"
        }';
    }
    

?>