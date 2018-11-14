/* jshint  esversion: 6 */
const gameModel = require('../models/game')
const userModel = require('../models/users')
const ws = require('./game')
const wsModel = require('../models/socket')

module.exports = (io) => {

  // WebSocket handler
  io.on('connection', (socket) => {

    console.log(`${socket.id} user connnected`);

    socket.on('disconnect', function () {
      console.log('user disconnected');
    })


    // tagger session setter
    socket.on('tagger-session', (data) => {

      // set session variables
      socket.handshake.session.key = data.session_key
      socket.handshake.session.game = data.session_key
      socket.handshake.session.tid = data.tag_id
      socket.handshake.session.gid = data.game_id
      socket.handshake.session.save()

    })

    // listens to vInit emit event
    socket.on('vInit', (data) => {

      if (socket.handshake.session.parent && socket.handshake.session.game) {
        const game = socket.handshake.session.game;

        var Data = {};

        gameModel.gameActivity(game, (err, rows, fields) => {
          if (err) {
            console.log(`Error1: ${err}`);
          } else {
            if (rows == 0) {
              socket.emit('vInit', {
                success: false,
                message: 'Sorry! No tags to display'
              })
            } else {
              // store results
              Data.subject_id = rows[0].subject_id
              Data.player = rows[0].player_id
              Data.opponent = rows[0].opponent_id
              Data.tag_id = rows[0].tag_id

              // ADD TO SESSION VARIALBLES
              socket.handshake.session.tag_id = Data.tag_id
              socket.handshake.session.sub_id = Data.subject_id
              socket.handshake.session.save()

              // getting player names
              player = Data.player
              gameModel.p_name(player, (err, rows, fields) => {
                if (err) {
                  console.log(`Error2: ${err}`);
                } else {
                  if (rows == 0) {
                    console.log('Failed to fetch player name');
                  } else {
                    Data.p_username = rows[0].useranme
                    Data.p_fullname = rows[0].fullname

                  }
                }
              })

              // getting opponent names
              opponent = Data.opponent
              gameModel.o_name(opponent, (err, rows, fields) => {
                if (err) {
                  console.log(`Error3: ${err}`);
                } else {
                  if (rows == 0) {
                    console.log('Failed to fetch player name');
                  } else {
                    Data.o_username = rows[0].useranme
                    Data.o_fullname = rows[0].fullname
                  }
                }
              })

              // get subject
              subject_id = Data.subject_id
              gameModel.subj(subject_id, (err, rows, fields) => {
                if (err) {
                  console.log(`Error4: ${err}`);
                } else {
                  if (rows == 0) {
                    console.log('Failed to fetch player name');
                  } else {
                    // store results
                    Data.subject = rows[0].subject
                  }
                }
              })

              // get viewers
              gameModel.viewers(game, (err, rows, fields) => {
                if (err) {
                  console.log(`Error5: ${err}`);
                } else {
                  if (rows == 0) {
                    console.log('Failed to fetch player name');
                  } else {
                    // store results
                    Data.viewers = rows[0].viewers
                  }
                }
              })

              // get turns for player
              tag_id = Data.tag_id
              gameModel.turns_p_query(tag_id, player, (err, rows, fields) => {
                if (err) {
                  console.log(`Error6: ${err}`);
                } else {
                  if (rows == 0) {
                    console.log('Failed to fetch player name');
                  } else {
                    // store results
                    Data.p_turns = rows[0].is_player
                  }
                }
              })

              // get turns for opponent
              gameModel.turns_o_query(tag_id, opponent, (err, rows, fields) => {
                if (err) {
                  console.log(`Error7: ${err}`);
                } else {
                  if (rows == 0) {
                    console.log('Failed to fetch player name');
                  } else {
                    // store results
                    Data.o_turns = rows[0].is_player
                  }
                }
              })

              // Getting the scores for player
              gameModel.player_score(player, game, (err, rows, fields) => {
                if (err) {
                  console.log(`Error8: ${err}`);
                } else {
                  if (rows == 0) {
                    // store results
                    Data.correct = 0
                    Data.wrong = 0
                    Data.scores = 0
                    Data.p_ques = 0
                  } else {
                    // store results
                    Data.correct = rows[0].correct
                    Data.wrong = rows[0].wrong
                    Data.scores = rows[0].scores
                    Data.p_ques = rows[0].questions
                  }
                }
              })

              // Getting the scores for opponent
              gameModel.opponent_score(opponent, game, (err, rows, fields) => {
                if (err) {
                  console.log(`Error9: ${err}`);
                } else {
                  if (rows == 0) {
                    // store results
                    Data.o_correct = 0
                    Data.o_wrong = 0
                    Data.o_scores = 0
                    Data.o_ques = 0
                  } else {
                    // store results
                    Data.o_correct = rows[0].correct
                    Data.o_wrong = rows[0].wrong
                    Data.o_scores = rows[0].scores
                    Data.o_ques = rows[0].questions
                  }
                  // RETURN SERVER RESPONSE
                  //   console.log(Data)
                  socket.emit('vInit', Data)
                }
              })

            } // first stage ends here
          }
        })
      } else {
        // emit 401 error
        // socket.emit('vInit', {success: false, message: 'Unauthorized Access /'})
        console.log('Invalid session')
      }
    })



    // listens to Needed
    socket.on('needed', (data) => {

      if (socket.handshake.session.parent) {
        var parent = socket.handshake.session.parent,
          game = socket.handshake.session.game;

        // Query to get ward_id from guardian tbl
        wsModel.wardId(parent, (err, rows, fields) => {
          if (err) {
            console.log(`Error10: ${err}`);
          } else {
            if (rows == 0) {
              // emit RESPONSE
              socket.emit('needed', {
                success: false
              })
            } else {
              var ward_id = rows[0].ward_id
              // emit RESPONSE
              socket.emit('needed', {
                success: true
              })
            }
          }
        })
      }
    })

    // ON CHAT OPEN

    // ON CHAT CLOSED

    // ON PARENT CHATTER
    socket.on('parent-chatter', (data) => {

      if (socket.handshake.session.parent) {
        var parent = socket.handshake.session.parent,
          game = socket.handshake.session.game;

        // Query to get ward_id from guardian tbl
        wsModel.wardId(parent, (err, rows, fields) => {
          if (err) {
            console.log(`Error11: ${err}`);
          } else {
            if (rows == 0) {
              // emit RESPONSE
              socket.emit('parent-chatter', {
                success: false,
                message: 'Sorry! ward does not exist'
              })
            } else {
              var ward_id = rows[0].ward_id

              // Query to get ward usrname from users tbl
              wsModel.wardUsername(ward_id, (err, rows, fields) => {
                if (err) {
                  console.log(`Error12: ${err}`);
                } else {
                  if (rows == 0) {
                    // emit error
                    socket.emit('parent-chatter', { success: false })
                  } else {
                    // store result
                    var username = rows[0].username;


                    // chat logic
                    wsModel.getChats(username, parent, (err, rows, fields) => {
                      if (err) {
                        console.log(`Error13: ${err}`);
                      } else {
                        if (rows > 0) {
                          // emit response
                          socket.emit('parent-chatter', {
                            data: rows[0]
                          })
                        } else {
                          // will emit empty chats
                          socket.emit('parent-chatter', {
                            success: false,
                            message: 'There are no chats to display'
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

      }
      else {
      	// RETURN 401 ERROR
      	console.log('parent-chatter', {success: false, message: 'Unauthorized Access /'});
      }
    })

    // viewers game over
    socket.on('vGameOver', (data) => {
      if (socket.handshake.session.game && socket.handshake.session.wid) {
        var uid = socket.handshake.session.wid,
          key = socket.handshake.session.game;

        // Get tag
        wsModel.getTag(key, (err, rows, fields) => {
          if (err) {
            console.log(`Error14: ${err}`);
          } else {
            if (rows == 0) {
              // emit RESPONSE
              socket.emit('vGameOver', {
                success: false,
                message: 'Sorry! There are no games with that key'
              })
            } else {

              if (uid === rows[0].player_id) {
                // store player result
                var player_id = rows[0].player_id,
                  p_scores = rows[0].scores;
              }

              if (uid !== rows[0].player_id) {
                // store opponent result
                var opp = rows[0].player_id,
                  o_scores = rows[0].scores;
              }

              // scores logic for opponent
              if (o_scores > p_scores) {
                var opponent = 'Win';
              } else if (o_scores == p_scores) {
                var opponent = 'Draw';
              } else {
                var opponent = 'Lost';
              }

              // player scores logic
              if (o_scores < p_scores) {
                var player = 'Win';
              } else if (o_scores == p_scores) {
                var player = 'Draw';
              } else {
                var player = 'Lost';
              }

            }
          }

          var data = {
            player: player,
            opponent: opponent
          }
          // emit RESPONSE
          socket.emit('vGameOver', data)
        })
      }
    })

    // vQues
    socket.on('vQues', (data) => {
      if (socket.handshake.session.game) {


        var key = socket.handshake.session.game
        Data = {};

        // Query for question id from vQues tbl
        wsModel.vQues(key, (err, rows, fields) => {
          if (err) {
            console.log(`Error15: ${err}`);
          } else {
            if (rows == 0) {
              // emit response
              console.log('Failed to get questions id');
            } else {
              // store result
              Data.sid = rows[0].subject_id
              Data.qid = rows[0].question_id;

              // ADD TO SESSION VARIALBLES
              socket.handshake.session.questions_id = Data.qid
              socket.handshake.session.subject_id = Data.sid
              socket.handshake.session.save();
            }

            // Get the actual question
            qid = Data.qid;
            wsModel.vQuesQues(qid, (err, rows, fields) => {
              if (err) {
                console.log(`Error16: ${err}`);
              } else {
                if (rows == 0) {
                  // emit response
                  console.log('Failed to get questions');
                } else {
                  // store result
                  Data.question = rows[0].question
                }

                // EMIT RESPONSE
                socket.emit('vQues', Data);

              }
            })

            // Get the answers
            // wsModel.vQuesAns(qid, (err, rows, fields) => {
            //   if (err) {
            //     console.log(`Error17: ${err}`);
            //   } else {
            //     if (rows == 0) {
            //       // emit response
            //       console.log('Failed to get answer');
            //     } else {
            //       // store result
            //       Data.answer = rows[0].answer
            //     }

            //     // console.log(Data);
            //   }
            // })
          }
        })

      } else {
        // EMIT 401 ERROR
        // socket.emit('vQues', {success: false, message: 'Unauthorized Access /'});
        console.log('vQues', {
          success: false,
          message: 'Unauthorized Access /'
        });
      }

    })


    // get viewers answers
    socket.on('getViewerAns', (data) => {
      if (socket.handshake.session.subject_id && socket.handshake.session.questions_id) {

        var Data = {};
        var ques_id = socket.handshake.session.questions_id,
          key = socket.handshake.session.game,
          sub_id = socket.handshake.session.subject_id;


        // Get viewers questions id
        wsModel.vGetQues(sub_id, key, (err, rows, fields) => {
          if (err) {
            console.log(`Error18: ${err}`);
          } else {
            if (rows == 0) {
              // emit response
              // socket.emit('getViewerAns', {question: 'I didnt get anything'});
              console.log('getViewerAns', {
                question: 'I didnt get anything'
              });
            } else {
              // store result
              Data.question_id = rows[0].question_id

              socket.handshake.session.vQuesId = Data.question_id
              socket.handshake.session.save()

              // Get the viewers actual question
              question_id = Data.question_id
              wsModel.vGetActualQues(question_id, (err, rows, fields) => {
                if (err) {
                  console.log(`Error19: ${err}`);
                } else {
                  if (rows == 0) {
                    // emit response
                    socket.emit('getViewerAns', {
                      success: false,
                      message: 'No questions came'
                    });
                  } else {
                    // store result
                    Data.question = rows[0].question
                  }
                }
              })

              // Query to get answers
              wsModel.vQuesAns(question_id, (err, rows, fields) => {
                if (err) {
                  console.log(`Error20: ${err}`);
                } else {
                  if (rows == 0) {
                    // emit response
                    socket.emit('getViewerAns', {
                      success: false,
                      message: 'No questions came'
                    });
                  } else {
                    // store result in a js array
                    var data = [{}, {}, {}, {}];
                    data[0].answer = rows[0].option_1
                    data[1].answer = rows[0].option_2
                    data[2].answer = rows[0].option_3
                    data[3].answer = rows[0].answer

                    // emit response
                    socket.emit('getViewerAns', data);
                    // console.log('getViewerAns', data);
                  }
                }
              })
            }
          }
        })

      } else {
        // EMIT 401 ERROR
        // socket.emit('getViewerAns', {success: false, message: 'Unauthorized Access /'});
        console.log('getViewerAns', {
          success: false,
          message: 'Unauthorized Access /'
        });
      }
    })


    // get live data
    socket.on('getLiveData', (data) => {
      var key = data;

      // get tag
      wsModel.vGetTag(key, (err, rows, fields) => {
        var Data = {};
        Data.key = key

        if (err) {
          console.log(`Error21: ${err}`);
        } else {
          if (rows == 0) {
            // emit response
            socket.emit('getLiveData', {
              success: false,
              message: 'Sorry! There are no games with that ID'
            });
          } else {
            // store result
            Data.player_id = rows[0].player_id
            Data.opponent_id = rows[0].opponent_id
            Data.subject_id = rows[0].subject_id
            Data.tag_id = rows[0].tag_id



            // Get question id
            subject_id = Data.subject_id
            wsModel.GetQuesId(key, subject_id, (err, rows, fields) => {
              if (err) {
                console.log(`Error22: ${err}`);
              } else {
                if (rows == 0) {
                  // emit response
                  console.log(`Failed to fetch question\'s id`);
                } else {
                  // store result
                  Data.question_id = rows[0].question_id
                }

                // get questions
                question_id = Data.question_id
                wsModel.GetQues(question_id, subject_id, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error23: ${err}`);
                  } else {
                    if (rows == 0) {
                      // emit response
                      console.log(`Failed to fetch questions`);
                    } else {
                      // store result
                      Data.question = rows[0].question
                      Data.answer = rows[0].answer
                    }
                  }
                })


                // Get player 1 fullname
                player_id = Data.player_id
                wsModel.getP1(player_id, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error24: ${err}`);
                  } else {
                    if (rows == 0) {
                      // emit response
                      console.log(`Failed to fetch questions`);
                    } else {
                      // store result
                      Data.p_name = rows[0].fullname
                    }
                  }
                })

                // Get player 2 fullname
                opponent_id = Data.opponent_id
                wsModel.getP2(opponent_id, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error25: ${err}`);
                  } else {
                    if (rows == 0) {
                      // emit response
                      console.log(`Failed to fetch questions`);
                    } else {
                      // store result
                      Data.p2_name = rows[0].fullname
                    }
                  }
                })

                // Get subjects
                wsModel.getLiveSub(subject_id, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error26: ${err}`);
                  } else {
                    if (rows == 0) {
                      // emit response
                      console.log(`Failed to fetch subjects`);
                    } else {
                      // store results
                      Data.subject = rows[0].subject
                    }
                  }
                })

                // Get Scores for player 1
                key = Data.key
                wsModel.getP1Score(player_id, key, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error27: ${err}`);
                  } else {
                    if (rows == 0) {
                      // emit response
                      console.log(`Failed to fetch scores for player 1`);
                    } else {
                      // store results
                      Data.correct = rows[0].correct
                      Data.wrong = rows[0].wrong
                      Data.scores = rows[0].scores
                      Data.p_questions = rows[0].questions
                    }
                  }
                })

                // Get Scores for player 2
                opponent_id = Data.opponent_id
                // console.log(`${opponent_id} and ${key}`);
                wsModel.getP2Score(opponent_id, key, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error28: ${err}`);
                  } else {
                    if (rows == 0) {
                      // emit response
                      console.log(`Failed to fetch scores for player 2`);
                    } else {
                      // store results
                      Data.o_correct = rows[0].correct
                      Data.o_wrong = rows[0].wrong
                      Data.o_scores = rows[0].scores
                      Data.o_questions = rows[0].questions
                    }
                  }
                })

                // Get player 1 turn from turns tbl
                tag_id = Data.tag_id
                wsModel.getP1Turn(player_id, tag_id, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error29: ${err}`);
                  } else {
                    if (rows == 0) {
                      // emit response
                      console.log(`Failed to fetch scores`);
                    } else {
                      // store results
                      Data.p1turn = rows[0].is_player
                    }
                  }
                })

                // Get player 2 turn from turns tbl
                wsModel.getP2Turn(opponent_id, tag_id, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error30: ${err}`);
                  } else {
                    if (rows == 0) {
                      // emit response
                      console.log(`Failed to fetch scores`);
                    } else {
                      // store results
                      Data.p2turn = rows[0].is_player
                    }
                  }
                })

                // Get viewers from game tbl
                wsModel.getViews(key, (err, rows, fields) => {
                  if (err) {
                    console.log(`Error31: ${err}`);
                  } else {
                    if (rows == 0) {
                      // emit response
                      console.log(`Failed to fetch scores`);
                    } else {
                      // store results
                      Data.v_count = rows[0].viewers
                    }

                    // ADD TO SESSION VARIALBLES
                    socket.handshake.session.QID = Data.question_id
                    socket.handshake.session.wid = Data.player_id
                    socket.handshake.session.game = Data.key
                    socket.handshake.session.save()

                    // EMIT RESPONSE
                    socket.emit('getLiveData', Data);
                  }
                })
              }
            })
          }
        }
      })

    })

    // getLiveAns
    socket.on('getLiveAns', (data) => {
      if (socket.handshake.session.QID) {
        var question_id = socket.handshake.session.QID;

        wsModel.getLiveAns(question_id, (err, rows, fields) => {
          if (err) {
            console.log(`Error32: ${err}`);
          } else {
            if (rows == 0) {
              // emit response
              console.log(`Failed to fetch answers`);
            } else {
              // store results
              var data = {};
              data.option2 = rows[0].option_1
              data.option1 = rows[0].answer
              data.option3 = rows[0].option_2
              data.option4 = rows[0].option_3

              // emit response
              socket.emit('getLiveAns', data)
            }
          }
        })

      } else {
        // Emit error
        console.log('getLiveAns', {
          message: 'Question id is not set'
        })
      }
    })

    // get some questions
    socket.on('getQues', (data) => {
      if (socket.handshake.session.subject) {
        // store session variables
        var id = socket.handshake.session.subject_id,
          key = socket.handshake.session.key,
          uid = socket.handshake.session.uid,
          username = socket.handshake.session.username

        // get quiz subject id
        wsModel.getQuizSubId(id, (err, rows, fields) => {
          if (err) {
            console.log(`Error33: ${err}`);
          } else {
            if (rows == 0) {
              // emit response
              socket.emit('getQues', {
                success: false,
                message: 'There are no questions to display'
              });
            } else {
              // store results
              var Qid = rows[0].questions_id,
                question = rows[0].question,
                answer = rows[0].answer

              // getting available options
              wsModel.getAvailOpt(Qid, (err, rows, fields) => {
                if (err) {
                  console.log(`Error34: ${err}`);
                } else {
                  if (rows == 0) {
                    // emit response
                    socket.emit('getQues', {
                      success: false,
                      message: 'A fatal error has occured'
                    });
                  } else {
                    // store results
                    var option1 = rows[0].option1,
                      option2 = rows[0].option2,
                      option3 = rows[0].option3,
                      c_answer = rows[0].answer

                    // Inserting into vQues tbl
                    wsModel.vQuesInsert(Qid, id, key, (err, res) => {
                      if (err) {
                        console.log(`Error35: ${err}`);
                      } else {
                        if (res == 0) {
                          // emit response
                          console.log(`Failed to fetch questions`);
                        } else {
                          // store results
                          socket.handshake.session.questions_id = Qid;

                          // emit response
                          socket.emit('getQues', {
                            success: true
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
      } else {
        // emit 401 error
        socket.emit('getQues', {
          success: false,
          message: 'You have to SELECT a subject first'
        })
      }
    })

    // get quiz questions
    socket.on('getQuizQues', (data) => {
      if (socket.handshake.session.subject) {
        // store session variables
        var sub_id = socket.handshake.session.subject_id,
          key = socket.handshake.session.session_key,
          ques_id = socket.handshake.session.questions_id

        var vQuesId = socket.handshake.session.vQuesId

        // get quiz qid
        wsModel.getQuizQid(sub_id, key, (err, rows, fields) => {
          if (err) {
            console.log(`Error36: ${err}`);
          } else {
            if (rows == 0) {
              // emit response
              console.log('getQuizQues', {
                success: false,
                message: 'I didnt get anything'
              });
            } else {
              // store results
              var question_i = rows[0].question_id

              // add to session variables
              // socket.handshake.session.questions_id = question_id
              // socket.handshake.session.save(
              question_id = vQuesId;



              // Query the actual question
              wsModel.getQuizActualQues(question_id, (err, rows, fields) => {
                if (err) {
                  console.log(`Error37: ${err}`);
                } else {
                  if (rows == 0) {
                    // emit response
                    socket.emit('getQuizQues', {
                      success: false,
                      message: 'Failed to get question from server'
                    });
                  } else {
                    // store results
                    var question = rows[0].question
                  }

                  // emit result
                  socket.emit('getQuizQues', {
                    success: true,
                    question: question,
                    question_id: question_id
                  });
                }
              })
            }
          }
        })
      } else {
        // emit 401 error
        socket.emit('getQuizQues', {
          success: false,
          message: 'You have to SELECT a subject first'
        })
      }
    })


    // get quiz answers
    socket.on('getQuizAns', (data) => {
      if (socket.handshake.session.subject_id && socket.handshake.session.questions_id) {
        // store session variables
        var sub_id = socket.handshake.session.subject_id,
          key = socket.handshake.session.key,
          ques_id = socket.handshake.session.questions_id


        wsModel.getQuizQid(sub_id, key, (err, rows, fields) => {
          if (err) {
            console.log(`Error38: ${err}`);
          } else {
            if (rows == 0) {
              // emit response
              socket.emit('getQuizAns', {
                success: false,
                question: 'I didnt get anything'
              });
            } else {
              // store results
              var question_id = rows[0].questions_id

              // Query the actual question
              wsModel.getQuizActualQues(question_id, (err, rows, fields) => {
                if (err) {
                  console.log(`Error39: ${err}`);
                } else {
                  if (rows == 0) {
                    // emit response
                    socket.emit('getQuizAns', {
                      success: false,
                      message: 'Failed to get question from server'
                    });
                  } else {
                    // store results
                    var question = rows[0].question

                    // Query to get answers
                    // getting available options
                    wsModel.getQuizOpt(sub_id, question_id, (err, rows, fields) => {
                      if (err) {
                        console.log(`Error40: ${err}`);
                      } else {
                        if (rows == 0) {
                          // emit response
                          socket.emit('getQuizAns', {
                            success: false,
                            message: 'A fatal error has occured'
                          });
                        } else {
                          // store results
                          var data = [];
                          data['option1'] = rows[0].option1
                          data['option2'] = rows[0].option2
                          data['option3'] = rows[0].option3
                          data['option4'] = rows[0].answer
                        }
                      }
                    })

                    // emit results
                    socket.emit('getQuizAns', {
                      success: false,
                      message: 'A fatal error has occured'
                    });
                  }
                }
              })

              // emit result
              socket.emit('getQuizAns', data);
            }
          }
        })
      } else {
        // emit 401 error
        socket.emit('getQuizAns', {
          success: false
        })
      }

    })

    // quiz gameOver
    socket.on('GameOver', (data) => {
      if (socket.handshake.session.key && socket.handshake.session.uid) {
        var uid = socket.handshake.session.uid,
          key = socket.handshake.session.key;

        // Get tag
        wsModel.getTag(key, (err, rows, fields) => {
          if (err) {
            console.log(`Error41: ${err}`);
          } else {
            if (rows == 0) {
              // emit RESPONSE
              socket.emit('GameOver', {
                success: false,
                message: 'Sorry! There are no games with that key'
              })
            } else {

              if (uid === rows[0].player_id) {
                // store player result
                var player_id = rows[0].player_id,
                  p_scores = rows[0].scores;
              }

              if (uid !== rows[0].player_id) {
                // store opponent result
                var opp = rows[0].player_id,
                  o_scores = rows[0].scores;
              }

              // scores logic for opponent
              if (o_scores > p_scores) {
                var opponent = 'Win';
              } else if (o_scores == p_scores) {
                var opponent = 'Draw';
              } else {
                var opponent = 'Lost';
              }

              // player scores logic
              if (o_scores < p_scores) {
                var player = 'Win';
              } else if (o_scores == p_scores) {
                var player = 'Draw';
              } else {
                var player = 'Lost';
              }

            }
          }

          var data = {
            player: player,
            opponent: opponent
          }
          // emit RESPONSE
          socket.emit('GameOver', data)
        })
      }
    })

    // getter
    socket.on('getter', (data) => {

      if (socket.handshake.session.tid && socket.handshake.session.uid) {
        var uid = socket.handshake.session.uid,
          tid = socket.handshake.session.tid;

        // Get all from turns tbl getAllFrmTurn
        wsModel.getAllFrmTurn(tid, uid, (err, rows, fields) => {
          if (err) {
            console.log(`Error42: ${err}`);
          } else {
            if (rows == 0) {
              // emit response
              socket.emit('getter', {
                success: false,
                message: 'Oops! There are no turns to display'
              })
            } else {
              // store result
              var isTurn = rows[0].is_player;

              if (isTurn == 0) {
                // emit response
                socket.emit('getter', {
                  success: false
                })
              } else {
                // emit response
                socket.emit('getter', {
                  success: true
                })
              }
            }
          }
        })
      } else {
        // emit RESPONSE
        // socket.emit('getter', {success: false, message: 'Unauthorized Access /'})
        console.log(`Getter has Failed`)
      }
    })

    // score update
    socket.on('scoreUpdate', (data) => {
      if (socket.handshake.session.key && socket.handshake.session.uid) {
        // Saving session variables
        var player_id = socket.handshake.session.uid,
          key = socket.handshake.session.key,
          sid = socket.handshake.session.subject_id,
          tid = socket.handshake.session.tid,
          gid = socket.handshake.session.gid


        // Get the current value of the user's correct answers
        wsModel.getUserCorrectScores(player_id, key, (err, rows, fields) => {
          if (err) {
            console.log(`Error43: ${err}`);
          } else {
            if (rows == 0) {
              // store result
              var data = {
                p_correct: 0,
                p_scores: 0,
                p_wrong: 0,
                p_questions: 0,
                success: false
              }
              // emit response
              socket.emit('scoreUpdate', data)
            } else {
              // store result
              var data = {
                p_correct: rows[0].correct,
                p_scores: rows[0].scores,
                p_wrong: rows[0].wrong,
                p_questions: rows[0].questions,
                success: true
              }
              // emit response
              socket.emit('scoreUpdate', data)
            }
          }
        })
      } else {
        console.log(`Access denied for scoreUpdate`);
      }
    })

    // score updates for player 2
    socket.on('getP2Scores', (data) => {
      if (socket.handshake.session.key && socket.handshake.session.uid) {
        // Saving session variables
        var uid = socket.handshake.session.uid,
          key = socket.handshake.session.key,
          sid = socket.handshake.session.subject_id,
          tid = socket.handshake.session.tid,
          gid = socket.handshake.session.gid

        // Get the current value of the user's correct answers
        wsModel.getOppScores(uid, key, (err, rows, fields) => {
          if (err) {
            console.log(`Error44: ${err}`);
          } else {
            if (rows == 0) {
              // emit response
              var data = {
                o_correct: 0,
                o_scores: 0,
                o_wrong: 0,
                o_questions: 0
              }

              // emit response
              socket.emit('getP2Scores', data)
            } else {

              if (uid !== rows[0].player_id) {
                // store result
                var data = {
                  o_correct: rows[0].correct,
                  o_scores: rows[0].scores,
                  o_wrong: rows[0].wrong,
                  o_questions: rows[0].questions,
                  opponent: rows[0].player_id
                }
                // emit response
                socket.emit('getP2Scores', data)
              } else {
                // emit response
                socket.emit('getP2Scores', {
                  success: false,
                  message: 'Sorry! Player 2 has not responded yet'
                })
              }
            }
          }
        })


      } else {
        // // emit response
        console.log(`Access denied for P2 scoreUpdate`);
      }
    })

    // get viewers
    socket.on('getViewers', (data) => {
      if (socket.handshake.session.key) {
        var key = socket.handshake.session.key

        // Getting viewers
        wsModel.getViewers(key, (err, rows, fields) => {
          if (err) {
            console.log(`Error45: ${err}`);
          } else {
            if (rows == 0) {
              // emit response
              socket.emit('getViewers', {
                message: 'Oops! There are no turns to display'
              })
            } else {
              // store result
              var viewers = rows[0].viewers;

              // emit response
              socket.emit('getViewers', {
                viewers: viewers
              })
            }
          }
        })
      }
      // else {
      // 	// emit response
      // 	socket.emit('getViewers', {success: false})
      // }
    })

    // chatter
    socket.on('chatter', (data) => {
      if (socket.handshake.session.uid) {
        var key = socket.handshake.session.key,
          uid = socket.handshake.session.uid,
          username = socket.handshake.session.username

        // Query id and username from guardian tbl
        wsModel.getUserInfo(uid, (err, rows, fields) => {
          if (err) {
            console.log(`Error46: ${err}`);
          } else {
            if (rows == 0) {
              // emit response
              socket.emit('chatter', {
                success: false,
                message: 'Sorry! Guardian does not exist'
              })
            } else {
              // store result
              var guardian_id = rows[0].id,
                g_uname = rows[0].username;
            }

            // Query chats from the chat tbl
            wsModel.getAllChats(g_uname, username, (err, rows, fields) => {
              if (err) {
                console.log(`Error47: ${err}`);
              } else {

                if (rows == 0) {
                  // emit response
                  // socket.emit('chatter', {data: 'empty'})
                } else {
                  // store result
                  // emit response
                  socket.emit('chatter', rows)
                }
              }
            })
          }
        })

      } else {
        // emit response
        var data = {
          success: false,
          message: '401 Unauthorized Access /'
        }
        socket.emit('chatter', data)
      }

    })


  }) // <==== END OF IO CONNECTION

}
