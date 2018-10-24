const gameModel = require('../models/game')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded(({extended: false}));

module.exports = (app) => {

    var SESSION;

    app.get('/', (req, res) => {

      // gameModel.getAns((err, rows, fields) => {
      //   if ( err ) {
      //       console.log('A Fatal error occurred')   ;
      //   } else {
      //       if ( !rows ) {
      //           res.json({success: false, message: 'There are no points yet'});
      //       }
      //       else {
      //           // will return some values here
      //
      //           var data = [{},{},{},{}];
      //           data[0].ans = rows[0].option_1
      //           data[1].ans = rows[0].option_2
      //           data[2].ans = rows[0].option_3
      //           data[3].ans = rows[0].answer
      //           // console.log(data);
      //
      //           // for (var x in data) {
      //           //   if(data.hasOwnProperty(x)) {
      //           //     res.send(`<p> ${data[x].ans} </p>`);
      //           //   }
      //           // }
      //
      //
      //
      //       }
      //   }
      // })
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
                    if ( !rows ) {
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
              if ( !rows ) {
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
            if ( !rows ) {
              res.json({success: false, message: 'Sorry! Subject does not exist'})
            } else {
              var data = rows[0]

              // setting the session variables
              req.session.subject = data.subject
              req.session.subject_id = id

              // return response
              res.json({ success: true, message: data.subject });
              // log response
              console.log(data);

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
            if (!rows) {
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
              if (!rows) {
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
                    if ( !rows ) {
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
                    if ( !rows ) {
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
                    if ( !rows ) {
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
                    if ( !rows ) {
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
                    if ( !rows ) {
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
                    if ( !rows ) {
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
                    if ( !rows ) {
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
                    if ( !rows ) {
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


}
