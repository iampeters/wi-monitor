<?php
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    
    if(isset($_SESSION['QID'])) {
        
        $question_id = $_SESSION['QID'];

        # Dependency
        require 'db.php';

        #Array
        $list = array();

        # Query
        $sql = mysqli_query($conn, "select * from answers where question_id = '$question_id' ");
        
        while ($row = mysqli_fetch_assoc($sql)) {
            $list['option1'] = $row['answer'];
            $list['option2'] = $row['option_1'];
            $list['option3'] = $row['option_2'];
            $list['option4'] = $row['option_3'];
        }

        # Return results
        echo json_encode($list);

    } else {
        echo 'Question id is not set';
        exit();
    }