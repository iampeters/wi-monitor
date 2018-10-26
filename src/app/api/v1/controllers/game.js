const gameModel = require('../models/game')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded(({extended: false}));
const conn = require('../database/db');

module.exports = (app) => {

    var SESSION;

    app.get('/', (req, res) => {
        res.status(401).send('<small style="font-size: 12px; font-family: monospace">401 Unauthorized Access /</small>')
        res.end()
    })

    // leaderboard
    app.get('/leaderboard', (req, res) => {
        SESSION = req.session;

        if(SESSION.uid) {
            gameModel.leaderboard((err, rows, fields) => {
                if ( err ) {
                    console.log('A Fatal error occurred')   ;
                } else {
                    if ( rows == 0 ) {
                        res.json({success: false, message: 'There are no points yet'});
                    } else {
                        // will return some values here
                        res.json(rows);
                        // console.log(data);

                    }
                }
            })
        } else {
            res.json({success: false, message: 'Access denied!'})
        }
    })

    // get list of subjects
    app.get('/subjects', (req, res) => {
      if (req.session.username) {
        // getting subjects from the gameModel
        gameModel.subjects((err, rows, fields) => {
          if( err ) {
            console.log(`Error: ${err}`);
          } else {
              if ( rows == 0 ) {
                res.json({success: false, message: 'You have not added a subject yet'})
              } else {
                // send response back to client
                res.json(rows);
              }
          }
        })
      }
      else {
        res.status(401).send('401 Unauthorized Access /')
        res.end()
      }
    })

    // get user preferred subject
    app.post('/questions', jsonParser, ( req, res ) => {
      var id = req.body.subject
      // getting the user preferred subjects
      gameModel.questions( id, ( err, rows, fields ) => {
        if ( err ) {
          console.log(`Error: ${err}`);
        } else {
            if ( rows == 0 ) {
              res.json({success: false, message: 'Sorry! Subject does not exist'})
            } else {
              var data = rows[0]

              // setting the session variables
              req.session.subject = data.subject
              req.session.subject_id = id

              // return response
              res.json({ success: true, message: data.subject });
              // log response

            }
        }
      })

    })

    // get game for Parents
    app.get('/parent/get-game', (req, res) => {
      SESSION = req.session

      // checks if the parent session is set
      if (SESSION.parent) {
        // get games from database
        gameModel.getGame( (err, rows, fields) => {
          if (err) {
            console.log(`Error: ${err}`)   ;
          }
          else {
            if (rows == 0) {
              // RETURN ERROR
              res.json({success: false, message: 'Sorry! There are no games to display'})
              res.end();
            }
            else {
              // RETURN RESPONSE
              res.json(rows);
              res.end()
            }
          }
        })
      }
      else {
        res.status(401).send('Unauthorized Access /');
        res.end();
      }
    })

    // get the game Activity
    app.post('/game/activity', jsonParser, (req, res) => {
      SESSION = req.session
      const { game } = req.body;

      // checks for session variables
      if (SESSION.parent) {
        gameModel.gameActivity(game, (err, rows, fields) => {
          if (err) {
            console.log(`Error: ${err}`);
          }
          else {
              if (rows == 0) {
                res.json({success: false, message: 'Sorry! No tags to display'})
                res.end();
              }
              else {
                // store results
                var subject_id = rows[0].subject_id,
                    player = rows[0].player_id,
                    opponent = rows[0].opponent_id,
                    tag_id = rows[0].tag_id;

                // ADD TO SESSION VARIALBLES
                SESSION.tag_id = tag_id
                SESSION.sub_id = subject_id

                // getting player names
                gameModel.p_name(player, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if ( rows == 0 ) {
                      console.log('Failed to fetch player name');
                    }
                    else {
                      var p_username = rows[0].useranme,
                          p_fullname = rows[0].fullname;
                    }
                  }
                })

                // getting opponent names
                gameModel.o_name(opponent, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if ( rows == 0 ) {
                      console.log('Failed to fetch player name');
                    }
                    else {
                      var o_username = rows[0].useranme,
                          o_fullname = rows[0].fullname;
                    }
                  }
                })

                // get subject
                gameModel.subj(subject_id, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if ( rows == 0 ) {
                      console.log('Failed to fetch player name');
                    }
                    else {
                      // store results
                      var subject = rows[0].subject
                    }
                  }
                })

                // get viewers
                gameModel.viewers(game, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if ( rows == 0 ) {
                      console.log('Failed to fetch player name');
                    }
                    else {
                      // store results
                      var viewers = rows[0].viewers
                    }
                  }
                })

                // get turns for player
                gameModel.turns_p_query(tag_id, player, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if ( rows == 0 ) {
                      console.log('Failed to fetch player name');
                    }
                    else {
                      // store results
                      var p_turns = rows[0].is_player
                    }
                  }
                })

                // get turns for opponent
                gameModel.turns_o_query(tag_id, opponent, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if ( rows == 0 ) {
                      console.log('Failed to fetch player name');
                    }
                    else {
                      // store results
                      var o_turns = rows[0].is_player
                    }
                  }
                })

                // Getting the scores for player
                gameModel.player_score(player, game, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if ( rows == 0 ) {
                      // store results
                      var correct = 0,
                          wrong = 0,
                          scores = 0,
                          p_ques = 0;
                    }
                    else {
                      // store results
                      var correct = rows[0].correct,
                          wrong = rows[0].wrong,
                          scores = rows[0].scores,
                          p_ques = rows[0].questions;
                    }
                  }
                })

                // Getting the scores for opponent
                gameModel.opponent_score(opponent, game, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if ( rows == 0 ) {
                      // store results
                      var o_correct = 0,
                          o_wrong = 0,
                          o_scores = 0,
                          o_ques = 0;
                    }
                    else {
                      // store results
                      var o_correct = rows[0].correct,
                          o_wrong = rows[0].wrong,
                          o_scores = rows[0].scores,
                          o_ques = rows[0].questions;
                    }
                  }
                })

                // RETURN SERVER RESPONSE
                var data = {
                    success : true,
                    player : player,
                    opponent : opponent,
                    p_scores : scores,
                    p_correct : correct,
                    p_wrong : wrong,
                    o_scores : o_scores,
                    o_correct : o_correct,
                    o_wrong : o_wrong,
                    p_username : p_username,
                    o_username : o_username,
                    subject : subject,
                    p_fullname : p_fullname,
                    o_fullname : o_fullname,
                    viewers : viewers,
                    p_count : p_ques,
                    o_count : o_ques,
                    p_turn : p_turns,
                    o_turn : o_turns
                }

                res.json(data)
                res.end();
              }
          }
        })

      } else {
        res.status(401).send('Unauthorized Access /');
        res.end();
      }
    })


    // get chosen subject
    // get list of subjects
    app.get('/subjects/choice', (req, res) => {
      SESSION = req.session

      if (SESSION.username && SESSION.subject) {
        res.status(200).json({success: true, Subject: SESSION.subject, Username: SESSION.username})
        res.end()
      }
      else {
        res.status(401).json({success: false})
        res.end()
      }
    })

    // this will decrement question in the db
    app.get('/question/decrement', (req, res) => {
      SESSION = req.session

      if (SESSION.uid && SESSION.key) {
        var { uid, key } = SESSION;

        // Get current question
        gameModel.quesCount(uid, key, (err, rows, fields) => {
          if (err) {
            console.log(`Error: ${err}`);
          }
          else {
            if (rows == 0) {
              // emit response
              res.status(404).json(`Nothing came`);
              res.end();
            }
            else {
              // store results
              var question = rows[0].questions,
                  newVal = question - 1;

              // Update questions column
              gameModel.updateScores(newVal, uid, key, (err, rows, fields) => {
                if (err) {
                  console.log(`Error: ${err}`);
                }
                else {
                  if (rows == 0) {
                    // emit response
                    res.status(501).json(`Failed to Update column`);
                    res.end();
                  }
                  else {
                    res.status(200).json(`Column Updated`);
                    res.end();
                  }
                }
              })

            }
          }
        })
      }
      else {
        res.status(401).json({success: false, message: '401 Unauthorized Access /'})
        res.end()
      }
    })

    // check users choice
    app.post('/game/choice', jsonParser, (req, res) => {
      SESSION = req.session
      var { choice } = req.body,
          right = 1,
          score = 5,
          wrong = 1,
          gid = SESSION.gid,
          tid = SESSION.tid,
          key = SESSION.key,
          sid = SESSION.subject_id,
          player_id = SESSION.uid,
          ques_id = SESSION.questions_id,
          sub_id = SESSION.subject_id;

      // get answers with the ques_id and choice
      gameModel.getChoiceAns(ques_id, choice, (err, rows, fields) => {
        if (err) {
          console.log(`Error: ${err}`);
        }
        else {
          if (rows == 0) {
            // Get the current value of the user's wrong answers
            gameModel.getWrongVal(player_id, key, (err, rows, fields) => {
              if (rows) {
                var wrong_value = rows[0].wrong,
                    new_value = wrong_value + 1;
                // Update scores tbl with the current value of the wrong choice
                gameModel.UpdateWrong(new_value, player_id, (err, res) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if(res) {
                      res.json({
                          success: true,
                          value: new_value,
                          message: 'Wrong'
                      })
                    }
                    else {
                      console.log('Failed to insert into scores tbl');
                    }
                  }
                })
              }
              else {
                // Inserting the current value of the wrong choice
                gameModel.insertWrong(wrong, player_id, gid, tid, sid, key, (err, res) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if(res) {
                      res.json({success: true, value: 1, message: 'wrong'})
                    } else {
                      console.log('Failed to insert into scores tbl');
                    }
                  }
                })
              }
            })
          }
          else {
            // store result
            var answer = rows[0].answer
            // Get the current value of the user's correct answers

            gameModel.getCorVal(player_id, key, (err, rows, fields) => {
              if (err) {
                console.log(`Error: ${err}`);
              }
              else {
                if (rows == 0) {
                  // Inserting the current value of the correct choices
                  gameModel.ScoresInsert(player_id, right, score, gid, tid, sid, key, (err, res) => {
                    if (err) {
                      console.log(`Error: ${err}`);
                    }
                    else {
                      if (res == 0) {
                        console.log(`Error: Failed to insert into scores tbl`);
                      }
                      else {
                        res.json({
                            success: true,
                            value: 1,
                            scores: 5,
                            message : 'Correct'
                        })
                      }
                    }
                  })
                }
                else {
                  var correct_value = rows[0].correct,
                      scores = rows[0].scores,
                      new_value = correct_value + 1,
                      new_scores = scores + 5;

                  // update scores tbl with the current value of the correct choices
                  gameModel.ScoresUpdate(player_id, new_scores, new_value, (err, res) => {
                    if (err) {
                      console.log(`Error: ${err}`);
                    }
                    else {
                      if (res == 0) {
                        console.log(`Error: Failed to update scores`);
                      }
                      else {
                        res.status(200).json({
                            success: true,
                            value: new_value,
                            scores: new_scores,
                            message : 'Correct'
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        }
      })

    })



    // generator
    app.get('/game/generator', (req, res) => {
      SESSION = req.session

      if(SESSION.subject) {
        // session VARIALBLES
        var sid = SESSION.subject_id,
            key = SESSION.key,
            uid = SESSION.uid,
            username = SESSION.username

          // Query 1
          gameModel.generator(sid, (err, rows, fields) => {
            if (err) {
              console.log(`Error: ${err}`);
            }
            else {
              if(rows) {
                var Qid = rows[0].question_id,
                    question = rows[0].question,
                    answer = rows[0].answer

                // getting available options
                gameModel.generatorOptions(Qid, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error: ${err}`);
                  }
                  else {
                    if(rows) {
                      var option1 = rows[0].option_1,
                            option2 = rows[0].option_2,
                            option3 = rows[0].option_3,
                            c_answer = rows[0].answer

                      // Inserting into vQues tbl
                      gameModel.genvQuesIns(Qid, key, sid, (err, res) => {
                        if (err) {
                          console.log(`Error: ${err}`);
                        }
                        else {
                          if (res) {
                            res.json({
                                success: true,
                                Qid: Qid,
                                question: question
                            })
                          }
                          else {
                            console.log(`Failed to insert values`);
                          }
                        }
                      })
                    }
                    else {
                      res.json({
                          success: false,
                          message: 'A fatal error has occured'
                      })
                    }
                  }
                })

              }
              else {
                // No questions
                res.json({
                    success : false,
                    message : 'Sorry! There are no questions yet'
                })
              }
            }
          })
      }
      else {
        res.status(401).json({success: false})
      }
    })


    // game setter
    app.get('/game/setter', (req, res) => {
      SESSION = req.session

      if(SESSION.uid && SESSION.tid) {
        var uid = SESSION.uid,
            tid = SESSION.tid;

        // Getting players from the tag table
        gameModel.getSetterTag(tid, (err, rows, fields) => {
          if(err) {
            console.log('Error: ${err}');
          }
          else {
            if (rows) {
              // Assigning variables
              var db_tid = rows[0].tag_id,
                  db_player_id = rows[0].player_id,
                  db_opponent_id = rows[0].opponent_id

              if (uid === db_player_id) {
                // Getting the user id from the database
                gameModel.setterUserChk(db_player_id, tid, (err, rows, fields) => {
                  if(err) {
                    console.log('Error: ${err}');
                  }
                  else {
                    if (rows) {
                      // store results
                      var chk_p_id = rows[0].player_id,
                          isTurn = rows[0].is_player

                      if ( $isTurn == 1 ) {
                        // Updating the tbl to false if the tbl value is true
                        gameModel.Turnsetter(chk_p_id, tid, (err, res) => {
                          if(err) {
                            console.log('Error: ${err}');
                          }
                          else {
                            if (res == 0) {
                              res.json({
                                  success: false,
                                  message: "Oops! Could not start your turn"
                              })
                            }
                            else {
                              // Updating the opponent
                              gameModel.TurnsetterOpp(db_opponent_id, tid, (err, res) => {
                                if(err) {
                                  console.log('Error: ${err}');
                                }
                                else {
                                  if (res) {
                                    res.json({success: true })
                                  }
                                  else {
                                    res.json({success: false})
                                  }
                                }
                              })
                            }
                          }
                        })
                      }
                      else {
                        // Updating the tbl to true if the tbl value is false
                        gameModel.TurnsetterP1(chk_p_id, tid, (err, res) => {
                          if(err) {
                            console.log('Error: ${err}');
                          }
                          else {
                            if (res == 0) {
                              res.json({
                                  success: false,
                                  message: "Oops! Could not start your turn"
                              })
                            }
                            else {
                              // Updating the opponent
                              gameModel.TurnsetterP2(db_opponent_id, tid, (err, res) => {
                                if(err) {
                                  console.log('Error: ${err}');
                                }
                                else {
                                  if (res) {
                                    res.json({success: true })
                                  }
                                  else {
                                    res.json({success: false})
                                  }
                                }
                              })
                            }
                          }
                        })
                      }

                    }
                    else {
                      res.json({
                          success: false,
                          message: "Oops! Could not start your turn"
                      })
                    }
                  }
                })
              }
              else if (uid === db_opponent_id) {
                // Getting the user id from the database
                gameModel.setterUserChk2(db_opponent_id, tid, (err, rows, fields) => {
                  if(err) {
                    console.log('Error: ${err}');
                  }
                  else {
                    if (rows) {
                      // saving the results
                      var chk_p_id = rows[0].player_id,
                          isTurn = rows[0].is_player

                      if ( $isTurn == 1 ) {
                        // Updating the tbl to false if the tbl value is true
                        gameModel.Turnsetter2(chk_p_id, tid, (err, res) => {
                          if(err) {
                            console.log('Error: ${err}');
                          }
                          else {
                            if (res == 0) {
                              res.json({
                                  success: false,
                                  message: "Oops! Could not start your turn"
                              })
                            }
                            else {
                              // Updating the opponent
                              gameModel.TurnsetterOpp2(db_player_id, tid, (err, res) => {
                                if(err) {
                                  console.log('Error: ${err}');
                                }
                                else {
                                  if (res) {
                                    res.json({success: true})
                                  }
                                  else {
                                    res.json({success: false})
                                  }
                                }
                              })
                            }
                          }
                        })
                      }
                      else {
                        // Updating the tbl to true if the tbl value is false
                        gameModel.TurnsetterP1_2(chk_p_id, tid, (err, res) => {
                          if(err) {
                            console.log('Error: ${err}');
                          }
                          else {
                            if (res == 0) {
                              res.json({success: false, message: 'Oops! Could not start your turn'})
                            }
                            else {
                              // Updating the opponent
                              gameModel.TurnsetterOpp2_2(db_player_id, tid, (err, res) => {
                                if(err) {
                                  console.log('Error: ${err}');
                                }
                                else {
                                  if (res) {
                                    res.json({success: true})
                                  }
                                  else {
                                    res.json({success: false})
                                  }
                                }
                              })
                            }
                          }
                        })
                      }
                    }
                    else {
                      res.json({success: false, message: 'Oops! Could not start your turn'})
                    }
                  }
                })
              }
              else {
                res.json({success: false, message: 'Oops! There are no turns to display'})
              }

            }
            else {
              res.status(501).json({ success: false, message: 'Oops! Something went wrong'})
              res.end();
            }
          }
        })
      }
    })


    // session Unsetting
    app.get('/game/session-unset', (req, res) => {
      SESSION = req.session

      if(SESSION.subject) {
        var key = SESSION.key,
            username = SESSION.username,
            id = SESSION.uid

        // Updating scores
        gameModel.unsetScoreUpdate(id, key, username, (err, res) => {
          if(err) {
            console.log('Error: ${err}');
          }
          else {
            if (res) {
              console.log({success: true })
            }
            else {
              console.log({success: false })
            }
          }
        })

        // Updating tag
        gameModel.unsetTagUpdate(key, (err, res) => {
          if(err) {
            console.log('Error: ${err}');
          }
          else {
            if (res) {
              console.log({success: true })
            }
            else {
              console.log({success: false })
            }
          }
        })

        // Updating game
        gameModel.unsetGameUpdate(key, (err, res) => {
          if(err) {
            console.log('Error: ${err}');
          }
          else {
            if (res) {
              console.log({success: true })
            }
            else {
              console.log({success: false })
            }
          }
        })

        // unset sessions
        SESSION.subject = ''
        SESSION.subject_id = ''
        SESSION.gid = ''
        SESSION.tid = ''
        SESSION.key = ''

        res.json({success: true})

      }
      else {
        res.status(401).json({success: false, message: '401 Unauthorized Access /'})
      }
    })

    // chat OPEN
    // this will open the chat dialog
    app.post('/chat/open', (req, res) => {
      SESSION = req.session
      var { open } = req.body

      var username = SESSION.username,
          uid = SESSION.uid;

      // Query to get guardian from guardian tbl
      gameModel.chkGuard(uid, (err, rows, fields) => {
        if (err) {
          console.log(`Error: ${err}`);
        }
        else {
          if (rows) {
            var g_uname = rows[0].username
            res.json({success: true})
          }
          else {
            res.json({success: false})
          }

          gameModel.GuardUpdate(uid, g_uname, (err, res) => {
            if (err) {
              console.log(`Error: ${err}`);
            }
            else {
              if (res) {
                console.log({success: true})
              }
              else {
                console.log({success: false})
              }
            }
          })
        }
      })

    })

    // chat close
    // this will close the chat dialog
    app.post('/chat/close', (req, res) => {
      SESSION = req.session
      var { close } = req.body

      var username = SESSION.username,
          uid = SESSION.uid;

      // Query to get guardian from guardian tbl
      gameModel.chkGuard2(uid, (err, rows, fields) => {
        if (err) {
          console.log(`Error: ${err}`);
        }
        else {
          if (rows) {
            var g_uname = rows[0].username
            res.json({success: true})
          }
          else {
            res.json({success: false})
          }

          gameModel.GuardUpdate2(uid, g_uname, (err, res) => {
            if (err) {
              console.log(`Error: ${err}`);
            }
            else {
              if (res) {
                console.log({success: true})
              }
              else {
                console.log({success: false})
              }
            }
          })
        }
      })

    })

    // this will send chat message
    app.post('/chat/send', (req, res) => {
      SESSION = req.session
      var { message } = req.body,
          key = SESSION.key,
          uid = SESSION.uid,
          username = SESSION.username;

      if (message !== '') {
        // Query guardian table
        gameModel.chatGuardChk(uid, (err, rows, fields) => {
          if (err) {
            console.log(`Error: ${err}`);
          }
          else {
            if (rows) {
              var guardian_id = rows[0].id,
                  g_uname = rows[0].username;

              // insert into the chat table
              gameModel.chatInsert(username, g_uname, key, message, (err, res) => {
                if (err) {
                  console.log(`Error: ${err}`);
                }
                else {
                  if (res) {
                    // update needed in chat guardian tbl
                    gameModel.chatUpdate(g_uname, uid, (err, res) => {
                      if (err) {
                        console.log(`Error: ${err}`);
                      }
                      else {
                        if (res) {
                          res.status(200).json({success: true, message: 'Inserted'})
                          res.end()
                        }
                        else {
                          res.status(200).json({success: false, message: 'Failed to get help'})
                          res.end()
                        }
                      }
                    })
                  }
                  else {
                    console.log({success: false})
                  }
                }
              })

            }
            else {
              console.log({success: false, message: 'Nothing to display'})
            }
          }
        })

      }

    })
}
