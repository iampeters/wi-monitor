<?php
# starting session
    session_start();

    header('Access-Control-Allow-Origin: *');
    header("Content-Type: application/json; charset=UTF-8");
    $_POST = json_decode(file_get_contents('php://input'), true);


    if (isset($_SESSION['parent']) && isset($_POST['game'])) {

        $key = $_POST['game'];
        $viewer = $_SESSION['parent'];
        $pid = $_SESSION['parent_id'];


        # Dependencies
        require '../db.php';

        # Query
        $sql = mysqli_query($conn, "SELECT * from tag where session_key = '$key' and has_ended = 'false' ");
        
        if (mysqli_num_rows($sql) == 1) {
            $r = mysqli_fetch_assoc($sql);
            $player = $r['player_id'];
            $opponent = $r['opponent_id'];

            # Checking if this viewer is already on the list
            $viewers = mysqli_query($conn, "SELECT guardian_id from viewers where session_key = '$key' and guardian_id = '$pid' ");

            if (mysqli_num_rows($viewers) == 1) {
                # is this parent already viewing

                # Setting session variable
                $_SESSION['game'] = $key;
                $_SESSION['player'] = $player;
                $_SESSION['opponent'] = $opponent;
                

                echo '{
                    "success" : false,
                    "message" : "Viewer already added"
                }';

            } else {
                # Get the current viewer count from the game tbl
                $sql2 = mysqli_query($conn, "SELECT viewers from game where session_key = '$key' and has_ended = 0 ");

                $row = mysqli_fetch_assoc($sql2);
                $v_count = $row['viewers'];

                $new = $v_count + 1;
                
                # Update game tbl
                $update = mysqli_query($conn, "UPDATE game set viewers = '$new'  where session_key = '$key' and has_ended = 0 ");

                # Get guardian details from guardian tbl
                # I really can't recall why i put this query here or what i wanted to achieve with it
                $sql1 = mysqli_query($conn, "SELECT * from guardian where username = '$viewer' ");

                if (mysqli_num_rows($sql1) == 1) {
                    
                    $row1 = mysqli_fetch_assoc($sql1);
                    $vid = $row1['id'];
                    $fullname = $row1['fullname'];

                } else {
                    # return false
                    echo '{
                        "success" : false
                    }';

                }
                

                # Insert into the viewers tbl
                $query = mysqli_query($conn, "INSERT INTO viewers values (null, '$vid', '$key') ");

                if(!$query) {
                    echo '{
                        "success" : false,
                        "message" : "Sorry! Could not add viewer"
                    }';
                }
                
                # Setting session variable
                $_SESSION['game'] = $key;
                $_SESSION['player'] = $player;
                $_SESSION['opponent'] = $opponent;
                
                echo '{
                    "success" : true,
                    "message" : "Granted"
                }';
            }
            
           
        } else {
             echo '{
                "success" : false,
                "message" : "Sorry! There\'s are no ongoing games"
            }';
        }
        
       
    } else {
        echo '{
            "success" : false,
            "message" : "Hey! Are you sure you wanna do this?"
        }';
    }

?>