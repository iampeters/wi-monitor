<?php
    # starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);

    # Dependencies
    require '../db.php';


    # The below code would be used to constantly check if its a player's turn to play
    if ( isset($_SESSION['tid']) && isset( $_SESSION['uid'] ) ) {

        $tid = $_SESSION['tid'];
        $uid = $_SESSION['uid'];


        # Getting players from the tag table
        $get_tag = mysqli_query($conn, "select * from tag where tag_id = '$tid' ");

        if ( mysqli_num_rows($get_tag) > 0 ) {
            $tag_rows = mysqli_fetch_assoc($get_tag);

            # Assigning variables
            $db_tid = $tag_rows['tag_id'];
            $db_player_id = $tag_rows['player_id'];
            $db_opponent_id = $tag_rows['opponent_id'];

            # Checking who is the player | opponent
            if ( $uid === $db_player_id ) {

                # Getting the user id from the database
                $usrChk = mysqli_query($conn, "select * from turns where player_id = '$db_player_id' and tag_id = '$tid'  ");

                if ( mysqli_num_rows( $usrChk ) ) {
                    
                    # saving the results
                    $chkRows = mysqli_fetch_assoc( $usrChk );
                    
                    # Assigning results
                    $chk_p_id = $chkRows['player_id'];
                    $isTurn = $chkRows['is_player'];

                    if ( $isTurn == 1 ) {

                        # Updating the tbl to false if the tbl value is true
                        $update = mysqli_query($conn, "update turns set is_player = '0' where player_id = '$chk_p_id' and tag_id = '$tid' ");

                        if ( !$update) {
                            echo '{
                                "success": false,
                                "message": "Oops! Could not start your turn"
                            }';
                        } else {

                            # Updating the opponent
                            $opp_update = mysqli_query($conn, "update turns set is_player = '1' where player_id = '$db_opponent_id' and tag_id = '$tid'  ");

                            if ($opp_update) {

                                echo '{
                                    "success": true
                                }';

                            } else {
                                echo '{
                                    "success": false
                                }';
                            }
                            
                        }

                    } else {
                        
                        # Updating the tbl to true if the tbl value is false
                        $update = mysqli_query($conn, "update turns set is_player = '1' where player_id = '$chk_p_id' and tag_id = '$tid' ");

                        if ( !$update) {
                            echo '{
                                "success": false,
                                "message": "Oops! Could not start your turn"
                            }';
                        } else {

                           # Updating the opponent
                            $opp_update = mysqli_query($conn, "update turns set is_player = '0' where player_id = '$db_opponent_id' and tag_id = '$tid'  ");

                            if ($opp_update) {

                                echo '{
                                    "success": true
                                }';

                            } else {
                                echo '{
                                    "success": false
                                }';
                            }
                        }
                    }
                    
                } else {

                    # is there an error?
                    echo '{
                        "success": false,
                        "message": "Oops! Could not start your turn"
                    }';
                }
                
            } elseif ( $uid === $db_opponent_id ) {
                
                # Getting the user id from the database
                $usrChk = mysqli_query($conn, "select * from turns where player_id = '$db_opponent_id' and tag_id = '$tid'  ");

                if ( mysqli_num_rows( $usrChk ) ) {
                    
                    # saving the results
                    $chkRows = mysqli_fetch_assoc( $usrChk );
                    
                    # Assigning results
                    $chk_p_id = $chkRows['player_id'];
                    $isTurn = $chkRows['is_player'];

                    if ( $isTurn == 1 ) {

                        # Updating the tbl to false if the tbl value is true
                        $update = mysqli_query($conn, "update turns set is_player = '0' where player_id = '$chk_p_id' and tag_id = '$tid' ");

                        if ( !$update) {
                            echo '{
                                "success": false,
                                "message": "Oops! Could not start your turn"
                            }';
                        } else {
                            
                            # Updating the opponent
                            $opp_update = mysqli_query($conn, "update turns set is_player = '1' where player_id = '$db_player_id' and tag_id = '$tid'  ");

                            if ($opp_update) {

                                echo '{
                                    "success": true
                                }';

                            } else {
                                echo '{
                                    "success": false
                                }';
                            }
                        }

                    } else {
                        
                        # Updating the tbl to true if the tbl value is false
                        $update = mysqli_query($conn, "update turns set is_player = '1' where player_id = '$chk_p_id' and tag_id = '$tid' ");

                        if ( !$update) {
                            echo '{
                                "success": false,
                                "message": "Oops! Could not start your turn"
                            }';
                        } else {
                            # Updating the opponent
                            $opp_update = mysqli_query($conn, "update turns set is_player = '0' where player_id = '$db_player_id' and tag_id = '$tid'  ");

                            if ($opp_update) {

                                echo '{
                                    "success": true
                                }';

                            } else {

                                echo '{
                                    "success": false
                                }';
                            }
                        }
                    }
                    
                } else {

                    # is there an error?
                    echo '{

                        "success": false,
                        "message": "Oops! Could not start your turn"

                    }';
                }
                

            } else {
                echo '{

                    "success": false,
                    "message": "Oops! There are no turns to display"
                    
                }';
            }

        } else {
            # is there error??
            echo '{
                "success": false,
                "message":"Oops! Something went wrong"
            }';
        }

    } else {
        echo '{
            "success": false,
            "message": "Hehehe! Are you a learner?"
        }';
    }

?>