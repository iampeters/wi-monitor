<?php

    # Session
    session_start();

    # Header
    header('Access-Control-Allow-Origin: *');
    // header('Content-Type: application/json', true);

    // if (isset($_GET['gid'])) {
    //     $key = $_GET['gid'];

    $uid = $_SESSION['uid'];
    $sid = 13;
    // $key = $_SESSION['key'];

        function getRandQues() {
            global $sid;

            # Dependency
            require 'db.php';

            # Get tag
            $sql = mysqli_query($conn, "SELECT question, questions_id from questions where subject_id = '$sid' order by rand() limit 1");

            if ( mysqli_num_rows($sql) >  0 ) {
                $rows = mysqli_fetch_assoc($sql);
                $question = $rows['question'];
                $id = $rows['questions_id'];

                echo $id . '<br>';


                // function vQues() {
                    // global $sid;
                    // global $id;

                    # Dependency
                    require 'db.php';


                    # Select from vQues table
                    $select = mysqli_query($conn, "SELECT question_id from vQues where subject_id = '$sid' and question_id = '$id' ");

                    if (mysqli_num_rows($select) > 0) {
                        // echo 'found one question';
                        getRandQues();
                    } else {
                        echo 'found nothing';
                    }
                
                
                    # Insert into vQues table
                    // $insert = mysqli_query($conn, "");
            //     }

            //    vQues();
                
            } else {
                echo $message = 'Sorry! There are no questions';
            }
       }

       getRandQues();

    // } else {
    //     # Goto login page
    //     // headers('location: ../index.php');
    //     echo 'Not allowed';
    // }
    

?>