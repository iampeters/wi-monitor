const taggerModel = require('../models/tagger')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded(({extended: false}));

module.exports = (app) => {

  var SESSION;

  // Query the database to check for games with the subject id
  app.get('/tagger', (req, res) => {
      SESSION = req.session;

    if ( req.session.username && req.session.subject_id) {
      var logged_in_user_id = req.session.uid,
          username = req.session.username,
          subject_id = req.session.subject_id
          subject = req.session.subject
          randNum = `gid_${Math.floor(100000 + Math.random() * 900000)}`;

           // Query the database to check for games with the subject id
          taggerModel.tagger(subject_id, (err, rows, fields) => {
            if ( err ) {
              console.log(`Error!: ${err}`);
            }
            else {
              if ( rows == 0 ) {
                console.log('A error occurred');
              }
              else {
                // save the return values
                var tag_id = rows[0].tag_id,
                    tag_session_key = rows[0].session_key,
                    opponent = rows[0].opponent_id,
                    tag_user_id = rows[0].player_id,
                    has_ended = rows[0].has_ended,
                    isMerged = rows[0].is_merged

                // Checks if logged in user is not the player_id in the database and the opponent field is empty
                if ( opponent == "" && logged_in_user_id != tag_user_id) {
                  // Add logged in user as an opponent
                  taggerModel.tagger2(logged_in_user_id, randNum, subject_id, (err, res) => {
                    if ( err ) {
                      console.log(`Error!: ${err}`);
                    }
                    else {
                      if ( res == 0 ) {
                        res.json({success: false, message: 'Opponent failed to add'});
                      }
                      else {
                        // Insert into the game table and intialize the game
                        taggerModel.gameInsert(subject_id, tag_id, randNum, (err, res)  => {
                          if ( err ) {
                            console.log(`Error!: ${err}`);
                          }
                          else {
                              if ( res == 0 ) {
                                res.json({success: false, message: 'Game could not be initialized'})
                                res.end();
                              }
                              else {
                                  // Getting back the details of the players
                                  taggerModel.select_tag(randNum, (err, rows, fields) => {
                                    if (err) {
                                      console.log(`Error!: ${err}`);
                                    }
                                    else {
                                        if ( rows == 0 ) {
                                            res.json({success: false, message: 'Could not get tag back'})
                                            res.end();
                                        }
                                        else {
                                            // saving response
                                            var tag_key = rows[0].session_key,
                                                tag_id = rows[0].tag_id,
                                                o_id = rows[0].opponent_id,
                                                p_id = rows[0].player_id;

                                            // Getting username of players from users table
                                            taggerModel.select_users(p_id, (err, rows, fields) => {
                                                if (err) {
                                                    console.log('Error!: ${err}');
                                                }
                                                else {
                                                    if ( rows == 0 ) {
                                                        console.log('Failed to get the selected user');
                                                        res.end();
                                                    }
                                                    else {
                                                        // save the results
                                                        var player_row = rows[0].username;
                                                    }
                                                }
                                            }) // end of player username

                                            // Getting username of opponent from users table
                                            taggerModel.select_users2(o_id, (err, rows, fields) => {
                                                if (err) {
                                                    console.log(`Error!: ${err}`);
                                                }
                                                else {
                                                    if (rows == 0) {
                                                        console.log('Failed to get the selected user');
                                                        res.end();
                                                    }
                                                    else {
                                                        // save the results
                                                        var opponent_row = rows[0].username;
                                                    }
                                                }
                                            }) // end of opponent username

                                            // Get the game id
                                            taggerModel.game_query(tag_key, (err, rows, fields) => {
                                                if (err) {
                                                    console.log(`Error!: ${err}`);
                                                }
                                                else {
                                                    if (rows == 0) {
                                                        res.json({success: false, message: 'Sorry! Could not get the game'})
                                                        res.end();
                                                    }
                                                    else {
                                                        // store results
                                                        var gid = rows[0].game_id
                                                    }
                                                }
                                            }) // Get the game id

                                            // Making sure user doesn't already exist
                                            taggerModel.turn_chk(tag_id, o_id, (err, rows, fields) => {
                                                if (err) {
                                                    console.log(`Error: ${err}`);
                                                }
                                                else {
                                                    if ( rows == 0 ) {
                                                        // Inserting in to the turn table
                                                        taggerModel.turn_insert(o_id, tag_id, (err, res) => {
                                                            if (err) {
                                                                console.log(`Error: ${err}`);
                                                            }
                                                            else {
                                                                if (res == 0) {
                                                                    res.json({success: false, message: 'Could not insert into Turn tbl'})
                                                                }
                                                            }
                                                        }) // Inserting in to the turn table

                                                    }
                                                    else {
                                                        console.log('Error: User already exits');
                                                    }
                                                }
                                            }) // Making sure user doesn't already exist

                                            // SEND RESPONSE BACK TO THE CLIENT
                                            var data = {
                                                game_id: game_rows,
                                                tag_id: tag_id,
                                                subject_id: subject_id,
                                                subject: SESSION.subject,
                                                player_id: p_id,
                                                opponent_id: o_id,
                                                session_key: tag_key,
                                                player_name: player_row,
                                                opponent_name: opponent_row,
                                                loggedInUser: username,
                                                success: true,
                                                message: 'start'
                                            }

                                            //  SET SOME SESSION variables
                                            SESSION.gid = gid
                                            SESSION.tid = tag_id
                                            SESSION.key = session_key

                                            res.json(data);
                                            res.end();


                                        }
                                    }
                                  })
                            }
                          }
                        })
                      }
                    }
                  })
                }
                else if (logged_in_user_id == tag_user_id  && opponent == '') {
                    // send response back to client
                    res.json({message: 'Waiting for opponent to join the game', username: username, subject: subject})
                    res.end();
                }
                else {
                    // # This means the game is ongoing
                    // # A new game of the same subject would be created
                    taggerModel.insert_tagg(logged_in_user_id, subject_id, (err, res) => {
                        if (err) {
                            console.log(`Error: ${err}`);
                        }
                        else {
                            if ( res == 0 ) {
                                res.json({success: false, message: 'Failed to add new tag'})
                                res.end();
                            }
                            else {
                                // # Getting back the tag
                                taggerModel.get_tag(logged_in_user_id, subject_id, (err, rows, fields) => {
                                    if (err) {
                                        console.log(`Error: ${err}`);
                                    }
                                    else {
                                        if (rows == 0) {
                                            console.log('Failed to get tag');
                                        }
                                        else {
                                            // store result
                                            var tid = rows[0].tag_id
                                        }
                                    }
                                })

                                // Making sure user doesn't already exist
                                taggerModel.turn_chk2(tid, logged_in_user_id, (err, rows, fields) => {
                                    if (err) {
                                        console.log(`Error: ${err}`);
                                    }
                                    else {
                                        if (rows == 0) {
                                            // Insert in to the turn table
                                            taggerModel.turn_insert2(tid, logged_in_user_id, (err, res) => {
                                                if (err) {
                                                    console.log(`Error: ${err}`);
                                                }
                                                else {
                                                    if (res == 0) {
                                                        res.json({success: false, message: 'Could not insert into Turn tbl'})
                                                        res.end();
                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            console.log('Error: User already exits');
                                        }
                                    }
                                })
                            }
                        }

                        // return response to client
                        var data = {
                            success: true,
                            message: 'New tag created! Waiting for Opponent to join the game',
                            username: username,
                            subject: subject
                        }
                        res.json(data)
                        res.end();
                    })
                }

              }
            }
          })

          // Query the database for merged users
          taggerModel.query_isMerged(subject_id, logged_in_user_id, (err, rows, fields) => {
              if (err) {
                  console.log(`Error: ${err}`);
              }
              else {
                  if (rows) {
                      // store the variable
                      var tagID = rows[0].tag_id;

                      // # Get all player details and resume the game.
                      taggerModel.merged_select_tag(tagID, (err, rows, fields) => {
                          if (err) {
                              console.log(`Error: ${err}`);
                          }
                          else {
                              if (rows == 0) {
                                  // respond with custom error message
                                  res.json({success: false, message: 'Sorry! Could not get any match'})
                              }
                              else {
                                  // store player ids
                                  var p_id = rows[0].player_id,
                                      o_id = rows[0].opponent_id,
                                      game_id = rows[0].game_id,
                                      tag_id = rows[0].tag_id,
                                      subject_id = rows[0].subject_id,
                                      key = rows[0].session_key

                                  // # Getting username of players from users table
                                  taggerModel.merged_select_users(p_id, (err, rows, fields) => {
                                      if (err) {
                                        console.log(`Error: ${err}`);
                                      }
                                      else {
                                        if (rows == 0) {
                                          console.log('Error! Could not get player name');
                                        }
                                        else {
                                          // store results
                                          var player_name = rows[0].username;
                                        }
                                      }
                                  })
                                  // # Getting username of opponent from users table
                                  taggerModel.merged_select_users2(o_id, (err, rows, fields) => {
                                      if (err) {
                                        console.log(`Error: ${err}`);
                                      }
                                      else {
                                        if (rows == 0) {
                                          console.log('Error! Could not get opponent name');
                                        }
                                        else {
                                          // store results
                                          var opponent_name = rows[0].username;
                                        }
                                      }
                                  })

                                  // Making sure user doesn't already exist
                                  taggerModel.merged_turn_chk(tag_id, o_id, ( err, rows, fields ) => {
                                      if ( err ) {
                                        console.log(`Error: ${err}`);
                                      }
                                      else {
                                        if (rows) {
                                            console.log('Error: This shouldn\'t have happened');
                                        } else {
                                            // Inserting in to the turn table
                                            taggerModel.merged_turn_insert(tag_id, o_id, ( err, res ) => {
                                                if (err) {
                                                    console.log(`Error: ${err}`);
                                                }
                                                else {
                                                    if (res == 0) {
                                                        res.json({success: false, message: 'Could not insert into Turn tbl'})
                                                        res.end();
                                                    }
                                                }
                                            })
                                        }
                                      }
                                  })
                              }
                          }

                          // RETURN SERVER RESPONSE BACK TO CLIENT
                          var data = {
                                game_id: game_id,
                                tag_id: tag_id,
                                subject_id: subject_id,
                                subject: SESSION.subject,
                                player_id: p_id,
                                opponent_id: o_id,
                                session_key: key,
                                player_name: player_name,
                                opponent_name: opponent_name,
                                loggedInUser: username,
                                success: true,
                                message: "resume"
                          }

                          // ADDING TO THE SESSION
                          SESSION.gid = game_id,
                          SESSION.tid = tag_id,
                          SESSION.key = key;

                          res.json(data)
                          res.end()
                          // THE ABOVE CODE RETURNED SERVER RESPONSE BACK TO CLIENT
                      })
                  }
                  else {
                      // # This code will add a new tag with the session subject id
                      // # if there is no tag with the subject_id
                      taggerModel.merged_insert_tag( logged_in_user_id, subject_id, ( err, res ) => {
                          if ( err ) {
                            console.log(`Error: ${err}`);
                          }
                          else {
                            if ( res == 0 ) {
                                res.json({success: false, message: 'Failed to add a new tag'})
                                res.end();
                            }
                            else {
                              // Getting back the tag
                              taggerModel.merged_get_tag( logged_in_user_id, subject_id, ( err, rows, fields ) => {
                                if (err) {
                                  console.log(`Error: ${err}`);
                                }
                                else {
                                  if ( rows == 0 ) {
                                    console.log('Failed to get tag');
                                  }
                                  else {
                                    // store results
                                    var tid = rows[0].tag_id;

                                  }
                                }
                              })

                              // Making sure user doesn't already exist
                              taggerModel.merged_turn_chk2(tid, logged_in_user_id, (err, rows ,fields) => {
                                if (err) {
                                  console.log(`Error: ${err}`);
                                }
                                else {
                                  if (rows) {
                                    console.log('Error: This shouldn\'t have happened');
                                  }
                                  else {
                                    // Inserting in to the turn table
                                    taggerModel.merged_turn_insert2(tid, logged_in_user_id, (err, res) => {
                                      if (err) {
                                        console.log(`Error: ${err}`);
                                      }
                                      else {
                                        if (res == 0) {
                                          res.json({success: false, message: 'Could not insert into Turn tbl'})
                                        }
                                      }
                                    })

                                    // We will return some value

                                  }
                                }
                              })

                              // RETURN SERVER RESPONSE BACK TO CLIENT
                              var data = {
                                  success: true,
                                  message: 'New tag created!',
                                  username: username,
                                  subject: subject
                              }

                              res.json(data)
                              res.end();
                            }
                          }
                      })
                  }
              }
          })



    }
    else {
      res.status(401).json({success: false, message: 'Access denied'})
    }
  })

}
