const taggerModel = require('../models/tagger')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded(({extended: false}));


module.exports = (app) => {

  // Query the database to check for games with the subject id
  app.get('/tagger', (request, response) => {
      SESSION = request.session;


    if ( request.session.username && request.session.subject_id) {
      var logged_in_user_id = request.session.uid,
          username = request.session.username,
          subject_id = request.session.subject_id
          subject = request.session.subject
          randNum = `gid_${Math.floor(100000 + Math.random() * 900000)}`;

           // Query the database to check for games with the subject id
          taggerModel.tagger(subject_id, (err, rows, fields) => {
            if ( err ) {
              console.log(`Error1: ${err}`);
            }
            else {
              if ( rows != 0 ) {
                // save the return values
                var tag_id = rows[0].tag_id,
                    tag_session_key = rows[0].session_key,
                    opponent = rows[0].opponent_id,
                    tag_user_id = rows[0].player_id,
                    has_ended = rows[0].has_ended,
                    isMerged = rows[0].is_merged

                // Checks if logged in user is not the player_id in the database and the opponent field is empty
                if ( opponent == null && logged_in_user_id != tag_user_id) {
                  // Add logged in user as an opponent
                  taggerModel.tagger2(logged_in_user_id, randNum, subject_id, (err, res) => {
                    if ( err ) {
                      console.log(`Error2: ${err}`);
                    }
                    else {
                      if ( res == 0 ) {
                        response.json({success: false, message: 'Opponent failed to add'});
                      }
                      else {
                        // Insert into the game table and intialize the game
                        taggerModel.gameInsert(subject_id, tag_id, randNum, (err, res)  => {
                          if ( err ) {
                            console.log(`Error3: ${err}`);
                          }
                          else {
                              if ( res == 0 ) {
                                response.json({success: false, message: 'Game could not be initialized'})

                              }
                              else {
                                  // Getting back the details of the players
                                  taggerModel.select_tag(randNum, (err, rows, fields) => {
                                    if (err) {
                                      console.log(`Error4: ${err}`);
                                    }
                                    else {
                                        if ( rows == 0 ) {
                                            response.json({success: false, message: 'Could not get tag back'})

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
                                                    console.log('Error5: ${err}');
                                                }
                                                else {
                                                    if ( rows == 0 ) {
                                                        console.log('Failed to get the selected user');

                                                    }
                                                    else {
                                                        // save the results
                                                        var player_row = rows[0].username;
                                                    }
                                                }

                                                // Getting username of opponent from users table
                                                taggerModel.select_users2(o_id, (err, rows, fields) => {
                                                    if (err) {
                                                        console.log(`Error6: ${err}`);
                                                    }
                                                    else {
                                                        if (rows == 0) {
                                                            console.log('Failed to get the selected user');

                                                        }
                                                        else {
                                                            // save the results
                                                            var opponent_row = rows[0].username;
                                                        }

                                                        // Get the game id
                                                        taggerModel.game_query(tag_key, (err, rows, fields) => {
                                                            if (err) {
                                                                console.log(`Error7: ${err}`);
                                                            }
                                                            else {
                                                                if (rows == 0) {
                                                                    response.json({success: false, message: 'Sorry! Could not get the game'})

                                                                }
                                                                else {
                                                                    // store results
                                                                    var gid = rows[0].game_id
                                                                }
                                                                // Making sure user doesn't already exist
                                                                taggerModel.turn_chk(tag_id, o_id, (err, rows, fields) => {
                                                                    if (err) {
                                                                        console.log(`Error8: ${err}`);
                                                                    }
                                                                    else {
                                                                        if ( rows == 0 ) {
                                                                            // Inserting in to the turn table
                                                                            taggerModel.turn_insert(o_id, tag_id, (err, res) => {
                                                                                if (err) {
                                                                                    console.log(`Error9: ${err}`);
                                                                                }
                                                                                else {
                                                                                    if (res == 0) {
                                                                                        response.json({success: false, message: 'Could not insert into Turn tbl'})
                                                                                    }
                                                                                }
                                                                            }) // Inserting in to the turn table

                                                                        }
                                                                        else {
                                                                            console.log('Error10: User already exits');
                                                                        }
                                                                    }
                                                                })

                                                                // SEND RESPONSE BACK TO THE CLIENT
                                                                var data = {
                                                                    game_id: gid,
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
                                                                SESSION.key = tag_key

                                                                response.json(data);

                                                            }
                                                        }) // Get the game id

                                                    }
                                                }) // end of opponent username


                                            }) // end of player username
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
                else if (logged_in_user_id == tag_user_id  && opponent == null) {
                    // send response back to client
                    response.json({message: 'Waiting for opponent to join the game', username: username, subject: subject})
                    response.end();
                }
                else {
                    // # This means the game is ongoing
                    // # A new game of the same subject would be created
                    taggerModel.insert_tagg(logged_in_user_id, subject_id, (err, res) => {
                        if (err) {
                            console.log(`Error11: ${err}`);
                        }
                        else {
                            if ( res == 0 ) {
                                response.json({success: false, message: 'Failed to add new tag'})
                                response.end();
                            }
                            else {
                                // # Getting back the tag
                                taggerModel.get_tag(logged_in_user_id, subject_id, (err, rows, fields) => {
                                    if (err) {
                                        console.log(`Error12: ${err}`);
                                    }
                                    else {
                                        if (rows == 0) {
                                            console.log('Failed to get tag');
                                        }
                                        else {
                                            // store result
                                            var tid = rows[0].tag_id
                                        }

                                        // Making sure user doesn't already exist
                                        taggerModel.turn_chk2(tid, logged_in_user_id, (err, rows, fields) => {
                                            if (err) {
                                                console.log(`Error13: ${err}`);
                                            }
                                            else {
                                                if (rows == 0) {
                                                    // Insert in to the turn table
                                                    taggerModel.turn_insert2(tid, logged_in_user_id, (err, res) => {
                                                        if (err) {
                                                            console.log(`Error14: ${err}`);
                                                        }
                                                        else {
                                                            if (res == 0) {
                                                                response.json({success: false, message: 'Could not insert into Turn tbl'})
                                                                response.end();
                                                            }
                                                        }
                                                    })
                                                }
                                                else {
                                                    console.log('Error15: User already exits');
                                                }
                                            }
                                        })
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
                        response.json(data)
                        response.end();
                    })
                }

              }
              else {

                  // Query the database for merged users
                  taggerModel.query_isMerged(subject_id, logged_in_user_id, (err, rows, fields) => {
                      if (err) {
                          console.log(`Error16: ${err}`);
                      }
                      else {
                          if (rows != 0) {
                              // store the variable
                              var tagID = rows[0].tag_id;

                              // # Get all player details and resume the game.
                              taggerModel.merged_select_tag(tagID, (err, rows, fields) => {
                                  if (err) {
                                      console.log(`Error17: ${err}`);
                                  }
                                  else {
                                      if (rows == 0) {
                                          // respond with custom error message
                                          response.json({success: false, message: 'Sorry! Could not get any match'})
                                          response.end();
                                      }
                                      else {
                                          // store player ids
                                            p_id = rows[0].player_id
                                            o_id = rows[0].opponent_id
                                            game_id = rows[0].game_id
                                            tag_id = rows[0].tag_id
                                            subject_id = rows[0].subject_id
                                            key = rows[0].session_key

                                          // # Getting username of players from users table
                                          taggerModel.merged_select_users(p_id, (err, rows, fields) => {
                                              if (err) {
                                                console.log(`Error18: ${err}`);
                                              }
                                              else {
                                                if (rows == 0) {
                                                  console.log('Error! Could not get player name');
                                                }
                                                else {
                                                  // store results
                                                  player_name = rows[0].username;
                                                }

                                                // # Getting username of opponent from users table
                                                taggerModel.merged_select_users2(o_id, (err, rows, fields) => {
                                                    if (err) {
                                                      console.log(`Error19: ${err}`);
                                                    }
                                                    else {
                                                      if (rows == 0) {
                                                        console.log('Error! Could not get opponent name');
                                                      }
                                                      else {
                                                        // store results
                                                        opponent_name = rows[0].username;
                                                      }

                                                      // Making sure user doesn't already exist
                                                      taggerModel.merged_turn_chk(tag_id, o_id, ( err, rows, fields ) => {
                                                          if ( err ) {
                                                            console.log(`Error20: ${err}`);
                                                          }
                                                          else {
                                                            if (rows != 0) {
                                                                console.log('Error: This shouldn\'t have happened');
                                                            } else {
                                                                // Inserting in to the turn table
                                                                taggerModel.merged_turn_insert(tag_id, o_id, ( err, res ) => {
                                                                    if (err) {
                                                                        console.log(`Error21: ${err}`);
                                                                    }
                                                                    else {
                                                                        if (res == 0) {
                                                                            response.json({success: false, message: 'Could not insert into Turn tbl'})
                                                                            response.end();
                                                                        }
                                                                    }
                                                                })
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
                                                            SESSION.key = key

                                                            response.json(data);
                                                            // THE ABOVE CODE RETURNED SERVER RESPONSE BACK TO CLIENT
                                                          }
                                                      })

                                                    }
                                                })

                                              }
                                          })

                                      }
                                  }
                              })
                          }
                          else {
                              // # This code will add a new tag with the session subject id
                              // # if there is no tag with the subject_id
                              taggerModel.merged_insert_tag( logged_in_user_id, subject_id, ( err, res ) => {
                                  if ( err ) {
                                    console.log(`Error22: ${err}`);
                                  }
                                  else {
                                    if ( res == 0 ) {
                                        response.json({success: false, message: 'Failed to add a new tag'})
                                        response.end();
                                    }
                                    else {
                                      // Getting back the tag
                                      taggerModel.merged_get_tag( logged_in_user_id, subject_id, ( err, rows, fields ) => {
                                        if (err) {
                                          console.log(`Error23: ${err}`);
                                        }
                                        else {
                                          if ( rows == 0 ) {
                                            console.log('Failed to get tag');
                                          }
                                          else {
                                            // store results
                                            var tid = rows[0].tag_id;

                                          }

                                          // Making sure user doesn't already exist
                                          taggerModel.merged_turn_chk2(tid, logged_in_user_id, (err, rows ,fields) => {
                                            if (err) {
                                              console.log(`Error24: ${err}`);
                                            }
                                            else {
                                              if (rows != 0) {
                                                console.log('Error: This shouldn\'t have happened');
                                              }
                                              else {
                                                // Inserting in to the turn table
                                                taggerModel.merged_turn_insert2(tid, logged_in_user_id, (err, res) => {
                                                  if (err) {
                                                    console.log(`Error25: ${err}`);
                                                  }
                                                  else {
                                                    if (res == 0) {
                                                      response.json({success: false, message: 'Could not insert into Turn tbl'})
                                                      response.end();
                                                    }
                                                  }
                                                })

                                                // We will return some value

                                              }
                                            }
                                          })
                                        }
                                      })

                                      // RETURN SERVER RESPONSE BACK TO CLIENT
                                      var data = {
                                          success: true,
                                          message: 'New tag created!',
                                          username: username,
                                          subject: subject
                                      }

                                      response.json(data)
                                      response.end();
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
    else {
      response.status(401).json({success: false, message: 'Access denied'})
    }
  })

}
