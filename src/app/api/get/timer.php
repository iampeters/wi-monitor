<?php
    # starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    # Dependencies
    require '../db.php';

    if (isset($_SESSION['uid']) && isset($_SESSION['tid'])) {
        
        $uid = $_SESSION['uid'];
        $tid = $_SESSION['tid'];
        $key = $_SESSION['key'];

        $usrChk = mysqli_query($conn, "SELECT player_id, opponent_id from tag where session_key = '$key' ");

        if ( mysqli_num_rows( $usrChk) > 0 ) {
            
            $rows = mysqli_fetch_assoc($usrChk);

            $pid = $rows['player_id'];
            $oid = $rows['opponent_id'];


            if ( $uid == $pid ) {

                $sql = mysqli_query($conn, "UPDATE scores set timer = 0 where player_id = '$pid'  ");

                if ($sql) {
                    $sql2 = mysqli_query($conn, "UPDATE scores set timer = 15 where player_id = '$oid' ");

                } else {
                    echo '{
                        "success" : false,
                        "message" : "Oops! Something went wrong"
                    }';
                }
            } elseif ( $uid == $oid ) {
                 $sql = mysqli_query($conn, "UPDATE scores set timer = 0 where player_id = '$oid'  ");

                if ($sql) {
                    $sql2 = mysqli_query($conn, "UPDATE scores set timer = 15 where player_id = '$pid' ");
                    
                } else {
                    echo '{
                        "success" : false,
                        "message" : "Oops! Something went wrong"
                    }';
                }

            } else {
                echo '{
                    "success" : false,
                    "message" : "Oops! Something went wrong"
                }';
            }
        



        } else {
            echo '{
                "success" : false,
                "message" : "Oops! Could not find what you are looking for"
            }';
        }
        
    } else {
        echo '{
                "success" : false,
                "message" : "Oops! Could not find what you are looking for"
            }';
    }
    

?>