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
        $sql = mysqli_query($conn, "SELECT * from tag where session_key = '$key'  ");

        if ( mysqli_num_rows($sql) == 1 ) {
            $rows = mysqli_fetch_assoc($sql);

            $player_id = $rows['player_id'];
            $opponent_id = $rows['opponent_id'];
            $subject_id = $rows['subject_id'];


            
        } else {
            echo $message = 'Sorry! There are no games with that key';
        }

        # Get questions
        $getQuestion = mysqli_query($conn, "SELECT * FROM vQues WHERE session_key = '$key' order by id desc limit 1");
        


    } else {
        # Goto login page
        // headers('location: ../index.php');
        echo 'Not allowed';
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
</head>
<body>
    <!-- Preloader -->
<!-- <div class="preloader">
    <div class="loader animated pulse">
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__ball"></div>

    </div>
</div> -->
<!-- Preloader -->

<!-- chat -->
<div class="container-fluid" id="chat">
    <div class="row">
        <div class="c-overlay"></div>
        <div class="col-4 offset-4 card p-0">
            <form #chatForm="ngForm" (ngSubmit)="chat(chatForm.value); chatForm.reset()">
                <div class="card-header"> Lifeline panel - Kindly be of assistance
                    <span (click)="close()" class="close" id="close">
                        <i class="fa fa-close"></i>
                    </span>
                </div>

                <div class="card-body">
                    <div class="area p-2" id="area">
                        <input type="hidden" name="hidden" #hidden="ngModel" [(ngModel)]="chatModel.chats" />

                        <div *ngFor="let chat of chats">
                            <div>
                                <span class="c-right bg-info mb-2">
                                    <span style="font-size: 10px" class="mb-2 text-white">{{ chat.sender}}</span>
                                <br>
                                <span>{{ chat.message }}</span>
                                </span>
                            </div>

                        </div>
                    </div>
                    <textarea name="txt" #txt='ngModel' [(ngModel)]=chatModel.message id="txt"></textarea>
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary">Send</button> &nbsp; <small class="text-danger text-center">{{empty}}</small>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- chat -->

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
                        <ng-template #waiting>
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

                                    <div class="spinner-layer spinner-green">
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
                        </ng-template>
                        <!-- Waing preloader -->

                        <!--Panel header -->
                        <div class="q-panel-header col-12">
                            <div class="col-4 score p-0">
                                <h6 class="text-white">{{activity.p_fullname}}</h6>
                                <span class="badge bg-success">Correct:</span> &nbsp;
                                <span class="badge bg-success">{{activity.p_correct}}</span>
                                <br>
                                <span class="badge bg-danger">Wrong:&nbsp;</span> &nbsp;
                                <span class="badge bg-danger">{{activity.p_wrong}}</span>
                            </div>
                            <div class="col-4 time text-center p-0">
                                <h6 class="viewer text-white">Viewers</h6>
                                <span class="badge bg-success">{{activity.viewers}}</span> &nbsp;
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
                                <span class="badge">{{time}} secs</span>

                            </div>
                        </div>
                        <!-- Panel body -->
                        <div class="q-panel-body col-12">
                            <div class="q-board">
                                <!-- <form #answerForm="ngForm" (ngSubmit)="userAns(answerForm.value); answerForm.reset()" *ngIf="isMerged; else showDiv"> -->
                                <!-- {{ answerForm.value | json }} -->
                                <!-- Question board header -->
                                <div class="q-board-header">
                                    <h5>{{ Ques.question }}</h5>
                                </div>
                                <!-- Question board content -->
                                <div #qBoard class="q-board-content">
                                    <div class="row">
                                        <div class="col-12 col-md-6 p-0" *ngFor="let option of choices; let i = index">
                                            <label for="_{{i+1}}" class="form-check-label btn btn-white btn-mod">
                                                    <span class="badge "> </span>
                                                    <span class="ans">{{option.answer}}</span>
                                                </label>
                                        </div>
                                    </div>

                                </div>
                                <!-- </form> -->
                                <!-- end of form  -->

                                <!-- This will be displayed if the user has not been merged -->
                                <ng-template #showDiv>
                                    <h6 class="text-white text-center">{{ msg }}</h6>
                                </ng-template>
                            </div>
                            <!-- ./ Panel body -->
                        </div>
                        <!-- Course -->
                        <div class="">
                            <div class="col-12 col-md-11 offset-md-1 text-white">
                                <span class="badge red">Subject:</span> {{ activity.subject }} &nbsp;
                                <span class="badge red">Questions:</span> {{activity.p_count}} &nbsp;
                                <span class="badge red">Score:</span> {{ activity.p_scores }}
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
                        <ng-template #waitin>
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

                                    <div class="spinner-layer spinner-green">
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
                        </ng-template>
                        <!-- Waing preloader -->

                        <!--Panel header -->
                        <div class="q-panel-header col-12">
                            <div class="col-4 score p-0">
                                <h6 class="text-white">{{activity.o_fullname}}</h6>
                                <span class="badge bg-success">Correct:</span> &nbsp;
                                <span class="badge bg-success">{{activity.o_correct}}</span>
                                <br>
                                <span class="badge bg-danger">Wrong:&nbsp;</span> &nbsp;
                                <span class="badge bg-danger">{{activity.o_wrong}}</span>
                            </div>
                            <div class="col-4 time text-center p-0">
                                <h6 class="viewer text-white">Viewers</h6>
                                <span class="badge bg-success">{{activity.viewers}}</span> &nbsp;
                            </div>

                            <div class="col-4 time text-right p-0">
                                <h6 class="text-white text-right">
                                    Time left:
                                </h6>
                                <span class="badge">{{time}} secs</span>

                            </div>
                        </div>
                        <!-- Panel body -->
                        <div class="q-panel-body col-12">
                            <div class="q-board">
                                <div class="q-board-header">
                                    <h5>{{ Ques.question }}</h5>
                                </div>
                                <!-- Question board content -->
                                <div #qBoard class="q-board-content">
                                    <div class="row">
                                        <div class="col-12 col-md-6 p-0" *ngFor="let choice of choices; let i = index">
                                            <label for="_{{i+5}}" class="form-check-label btn btn-white btn-mod">
                                                <span class="badge "> </span>
                                                <span class="ans">{{choice.answer}}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- end of form  -->

                                <!-- This will be displayed if the user has not been merged -->
                                <ng-template #showDiv>
                                    <h6 class="text-white text-center">{{ msg }}</h6>
                                </ng-template>
                            </div>
                            <!-- ./ Panel body -->
                        </div>
                        <!-- Course -->
                        <div class="">
                            <div class="col-12 col-md-11 offset-md-1 text-white">
                                <span class="badge red">Subject:</span> {{ activity.subject }} &nbsp;
                                <span class="badge red">Questions:</span> {{activity.o_count}} &nbsp;
                                <span class="badge red">Score:</span> {{ activity.o_scores }}
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
        <button (click)="logout()" class="btn btn-danger" style="font-size: 12px;">Logout</button>
    </div>
</div>


<!-- Footer -->
<!-- <app-footer></app-footer> -->
</body>
</html>