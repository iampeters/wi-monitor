<?php
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");


    // $numbers = range(1, 20);
    // shuffle($numbers);

    // foreach ($numbers as $number) {
    //     echo "$number ";
    // }

    require 'db.php';

    $query = mysqli_query($conn, "SELECT questions_id from questions where subject_id = 13 order by rand()");
        $arr = array();
    if (mysqli_num_rows($query) > 0) {
        while($rows = mysqli_fetch_assoc($query)) {
            $arr[] = $rows;
        }

        $question = $rows['questions_id'];
        

        $_SESSION['questions_id'] = $question;
        $_SESSION['sub_id'] = 13;
        
    } else {
        echo 'error';
    }

    $ques = $_SESSION['question'];

     print_r($arr);



    $sql = mysqli_query($conn, "SELECT answer, option_1, option_2, option_3 from answers where subject_id = 13 and question_id = '$ques' ");

    $list = array();

    if (mysqli_num_rows($sql) > 0) {
        while ($row = mysqli_fetch_assoc($sql)) {
            $list['ans'] = $row['answer'];
            $list['op1'] = $row['option_1'];
            $list['op2'] = $row['option_2'];
            $list['op3'] = $row['option_3'];
            
        }


        

        
        
        $count = count($list);
        shuffle($list);
        

        print_r($list);
    }