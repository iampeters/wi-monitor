<?php

    # Session
    session_start();

    # Header
    header('Access-Control-Allow-Origin: *');

    if (isset($_GET['gid'])) {
        $key = $_GET['gid'];

        # Dependency
        require 'db.php';

        # Get tag
        $sql = mysqli_query($conn, "SELECT * from tag where session_key = '$key' and has_ended = 'false' ");

        if ( mysqli_num_rows($sql) == 1 ) {
            $rows = mysqli_fetch_assoc($sql);

            $player_id = $rows['player_id'];
            $opponent_id = $rows['opponent_id'];
            $subject_id = $rows['subject_id'];

            # Get question id
            $getQuestionId = mysqli_query($conn, "SELECT * FROM vQues WHERE session_key = '$key' and subject_id = '$subject_id'  order by id desc limit 1");
            $ques_row = mysqli_fetch_assoc($getQuestionId);
            $question_id = $ques_row['question_id'];

            # Get questions
            $getQuestion = mysqli_query($conn, "SELECT * from questions where questions_id = '$question_id' and subject_id = '$subject_id' ");
            $ques_rows = mysqli_fetch_assoc($getQuestion);
            $answer = $ques_rows['answer'];
            $question = $ques_rows['question'];

            # Get player 1 users
            $getPlayer1 = mysqli_query($conn, "select username from users where user_id = '$player_id' ");
            $player_row = mysqli_fetch_assoc($getPlayer1);
            $p_name = $player_row['username'];

            # Get player 2 users
            $getPlayer2 = mysqli_query($conn, "select username from users where user_id = '$opponent_id' ");
            $player2_row = mysqli_fetch_assoc($getPlayer2);
            $p2_name = $player2_row['username'];

            # Get answers
            $ans = mysqli_query($conn, "select * from answers where question_id = '$question_id' ");
            
            $arr = array();
        

            # Get subjects
            $sub = mysqli_query($conn, "select subject from Subjects where subject_id = '$subject_id' ");
            $sub_row = mysqli_fetch_assoc($sub);
            $subject = $sub_row['subject'];

            # Get Scores for player 1
            $score = mysqli_query($conn, "select * from scores where session_key = '$key' and player_id = '$player_id' ");
            $score_row = mysqli_fetch_assoc($score);
            $correct = $score_row['correct'];
            $wrong = $score_row['wrong'];
            $scores = $score_row['scores'];

            # Get Scores for player 1
            $o_score = mysqli_query($conn, "select * from scores where session_key = '$key' and player_id = '$opponent_id' ");
            $o_score_row = mysqli_fetch_assoc($o_score);
            $o_correct = $o_score_row['correct'];
            $o_wrong = $o_score_row['wrong'];
            $o_scores = $o_score_row['scores'];


                
        } else {
            header('location: http://localhost/wi-monitor/src/app/api/?has_ended=ended');
            echo $message = 'Sorry! The game has ended';
            exit();
        }
    } else {
        echo $message = 'Sorry! There are no games with that key';
        exit();
    }
    

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>WI-MOINTO</title>
    
    <!-- LINKS -->
    <link rel="stylesheet" href="../../assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../assets/css/mdb.min.css">
    <link rel="stylesheet" href="../../assets/css/compiled.min.css">
    <link rel="stylesheet" href="../../assets/css/style.min.css?t='<?php echo time(); ?>'">
    
    <!-- SCRIPT -->
    <script src="../../assets/js/jquery-3.3.1.min.js"></script>
    <script src="../../assets/js/bootstrap.js"></script>
    <script src="../../assets/js/mdb.js"></script>
    <script src="../../assets/js/index.js?t='<?php echo time(); ?>'"></script>
    <script src="http://localhost/wi-monitor/src/assets/js/index.js?t='<?php echo time(); ?>'"></script>
</head>
<body>
<input class="linker" type="hidden" id="<?php echo $key; ?>" value="<?php echo $key; ?>">
<!-- Main wrapper -->
<div class="quiz-wrapper view">
    <div class="mask pattern-6"></div>
    <div class="container">
        <div class="row">
            <div class="col-12 q-panel-holder animated pulse">

                <!-- Player 1 Screen -->
                <div class="col-md-12 col-lg-6 col-12 player-1">

                    <div class="col-12 q-panel p-0">

                        <span *ngIf="activity.p_turn == 1; else waiting" class="animated fadeIn"></span>

                        <!-- Waing preloader -->
                        <!-- <ng-template #waiting>
                            <div class="col-12 waiting animated fadeIn">
                                <div class="preloader-wrapper big active">
                                    <div class="spinner-layer spinner-blue">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="gap-patch">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>

                                    <div class="spinner-layer spinner-red">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="gap-patch">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>

                                    <div class="spinner-layer spinner-yellow">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="gap-patch">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>

                                    <div class="spinner-layer spinner-red">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="gap-patch">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>
                                </div>
                                <h6>Waiting</h6>
                            </div>
                        </ng-template> -->
                        <!-- Waing preloader -->

                        <!--Panel header -->
                        <div class="q-panel-header col-12">
                            <div class="col-4 score p-0">
                                <h6 class="text-white"><?php echo $p_name; ?></h6>
                                <span class=" badge bg-success">Correct: 
                                    <span class="p1_correct"></span>
                                </span> &nbsp;
                                <span class="badge bg-success"></span>
                                <span class="badge bg-danger">Wrong:&nbsp;
                                    <span class="p1_wrong"></span>    
                                </span> &nbsp;
                                <span class="badge bg-danger"></span>
                            </div>
                            <div class="col-4 time text-center p-0">
                                <h6 class="viewer text-white">Viewers</h6>
                                <span class="badge bg-success"></span> &nbsp;
                            </div>

                            <!-- <div class="col-3 time text-right p-0">
                                <h3 class="text-danger">
                                    15 secs
                                </h3>
                            </div> -->
                            <!-- Time -->
                            <div class="col-4 time text-right p-0">
                                <h6 class="text-white text-right">
                                    Time left:
                                </h6>
                                <span class="badge"> secs</span>

                            </div>
                        </div>
                        <!-- Panel body -->
                        <div class="q-panel-body col-12">
                            <div class="q-board">
                                <!-- <form #answerForm="ngForm" (ngSubmit)="userAns(answerForm.value); answerForm.reset()" *ngIf="isMerged; else showDiv"> -->
                                <!-- {{ answerForm.value | json }} -->
                                <!-- Question board header -->
                                <div class="q-board-header">
                                    <h5 class="question"></h5>
                                </div>
                                <!-- Question board content -->
                                <div #qBoard class="q-board-content">
                                    <div class="row append">
                                        <div class="col-12 col-md-6 p-0">
                                            <label for="_{{i+1}}" class="form-check-label btn btn-white btn-mod">
                                                    <span class="ans option1"></span>
                                                </label>
                                        </div>
                                        <div class="col-12 col-md-6 p-0" *ngFor="let option of choices; let i = index">
                                            <label for="_{{i+1}}" class="form-check-label btn btn-white btn-mod">
                                                    <span class="ans option2"></span>
                                                </label>
                                        </div>
                                        <div class="col-12 col-md-6 p-0" *ngFor="let option of choices; let i = index">
                                            <label for="_{{i+1}}" class="form-check-label btn btn-white btn-mod">
                                                    <span class="ans option3"></span>
                                                </label>
                                        </div>
                                        <div class="col-12 col-md-6 p-0" *ngFor="let option of choices; let i = index">
                                            <label for="_{{i+1}}" class="form-check-label btn btn-white btn-mod">
                                                    <span class="ans option4"></span>
                                                </label>
                                        </div>
                                    </div>

                                </div>
                                <!-- </form> -->
                                <!-- end of form  -->

                                <!-- This will be displayed if the user has not been merged -->
                                <ng-template #showDiv>
                                    <!-- <h6 class="text-white text-center">{{ msg }}</h6> -->
                                </ng-template>
                            </div>
                            <!-- ./ Panel body -->
                        </div>
                        <!-- Course -->
                        <div class="">
                            <div class="col-12 col-md-11 offset-md-1 text-white">
                                <span class="badge red p-1"><b>Subject:</b></span> <?php echo $subject;?>
                                <span class="red badge p-1"><b>Questions:</b> &nbsp;  <span class="p1_questions"></span></span>
                                <span class="red badge p-1"><b>Score:</b> &nbsp;
                                <span class="p1_score"></span>
                            </span>
                            </div>
                        </div>

                        <!-- Panel footer -->
                        <div class="q-panel-footer col-12 mt-5">
                            <div class="row">
                                <!-- life line -->

                            </div>
                        </div>
                    </div>
                </div>


                <!-- Player 2 Screen -->
                <div class="col-md-12 col-lg-6 col-12 player-2">

                    <div class="col-12 q-panel p-0">

                        <span *ngIf="activity.o_turn == 1; else waitin"></span>

                        <!-- Waing preloader -->
                        <!-- <ng-template #waitin>
                            <div class="col-12 waiting animated fadeIn">
                                <div class="preloader-wrapper big active">
                                    <div class="spinner-layer spinner-blue">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="gap-patch">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>

                                    <div class="spinner-layer spinner-red">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="gap-patch">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>

                                    <div class="spinner-layer spinner-yellow">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="gap-patch">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>

                                    <div class="spinner-layer spinner-red">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="gap-patch">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>
                                </div>
                                <h6>Waiting</h6>
                            </div>
                        </ng-template> -->
                        <!-- Waing preloader -->

                        <!--Panel header -->
                        <div class="q-panel-header col-12">
                            <div class="col-4 score p-0">
                                <h6 class="text-white"><?php echo $p2_name; ?></h6>
                                <span class=" badge bg-success">Correct:  
                                    <span class="p2_correct"></span>
                                </span> &nbsp;
                                <span class="badge bg-success"></span>
                                <span class="badge bg-danger">Wrong:&nbsp; 
                                    <span class="p2_wrong"></span>
                                </span> &nbsp;
                                <span class="badge bg-danger"></span>
                            </div>
                            <div class="col-4 time text-center p-0">
                                <h6 class="viewer text-white">Viewers</h6>
                                <span class="badge bg-success"></span> &nbsp;
                            </div>

                            <div class="col-4 time text-right p-0">
                                <h6 class="text-white text-right">
                                    Time left:
                                </h6>
                                <span class="badge"> secs</span>

                            </div>
                        </div>
                        <!-- Panel body -->
                        <div class="q-panel-body col-12">
                            <div class="q-board">
                                <div class="q-board-header">
                                    <h5 class="question"></h5>
                                </div>
                                <!-- Question board content -->
                                <div #qBoard class="q-board-content">
                                    <div class="row append">
                                        <div class="col-12 col-md-6 p-0">
                                            <label for="_{{i+1}}" class="form-check-label btn btn-white btn-mod">
                                                    <span class="ans option1"></span>
                                                </label>
                                        </div>
                                        <div class="col-12 col-md-6 p-0" *ngFor="let option of choices; let i = index">
                                            <label for="_{{i+1}}" class="form-check-label btn btn-white btn-mod">
                                                    <span class="ans option2"></span>
                                                </label>
                                        </div>
                                        <div class="col-12 col-md-6 p-0" *ngFor="let option of choices; let i = index">
                                            <label for="_{{i+1}}" class="form-check-label btn btn-white btn-mod">
                                                    <span class="ans option3"></span>
                                                </label>
                                        </div>
                                        <div class="col-12 col-md-6 p-0" *ngFor="let option of choices; let i = index">
                                            <label for="_{{i+1}}" class="form-check-label btn btn-white btn-mod">
                                                    <span class="ans option4"></span>
                                                </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- end of form  -->

                                <!-- This will be displayed if the user has not been merged -->
                                <ng-template #showDiv>
                                    <!-- <h6 class="text-white text-center">{{ msg }}</h6> -->
                                </ng-template>
                            </div>
                            <!-- ./ Panel body -->
                        </div>
                        <!-- Course -->
                        <div class="">
                            <div class="col-12 col-md-11 offset-md-1 text-white">
                                <span class="badge red p-1"><b>Subject:</b></span> <?php echo $subject;?>
                                <span class="red badge p-1"><b>Questions:</b> &nbsp; <span class="p2_questions"></span></span>
                                <span class="red badge p-1"><b>Score:</b> &nbsp;
                                <span class="p2_score"></span>
                            </span>
                            </div>
                        </div>

                        <!-- Panel footer -->
                        <div class="q-panel-footer col-12 mt-5">
                            <div class="row">
                                <!-- life line -->

                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>
    <div align="right" class="col-1" style="position: absolute; bottom: 40px; right: 70px; z-index: 30001;">
        <button class="btn btn-danger" style="font-size: 12px;">Close</button>
    </div>
</div>


<script>


</script>
</body>
</html>