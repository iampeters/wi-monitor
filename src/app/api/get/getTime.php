<?php
    # starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");

    # Dependencies
    require '../db.php';

    if (isset($_SESSION['uid']) && isset($_SESSION['tid'])) {
        $uid = $_SESSION['uid'];

        $sql = mysqli_query($conn, "SELECT timer from scores where player_id = '$uid' ");

        if ( mysqli_num_rows( $sql ) == 1) {
            $rows = mysqli_fetch_assoc( $sql );

            $time = $rows['timer'];


            $end_time = date('Y-m-d H:i:s', strtotime('+'.$time.'seconds', strtotime(date("Y-m-d H:i:s"))));

            
            $et = strtotime($end_time);
            echo $et;

            if ($time == 0) {

                echo '{
                    "success" : true,
                    "time" : "'.$time.'"
                }';

            } else {
                $date= strtotime(date('Y-m-d H:i:s'));

                $add = strtotime($time) + $date;

                $diff = $add - $date; 

                echo '{
                    "success" : true,
                    "time" : "'.$diff.'"
                }';
            }
        }
    }

?>