const gameModel = require('../models/game')
const userModel = require('../models/users')
const ws = require('./game');
const wsModel = require('../models/socket')
// const socket = require('socket.io')

module.exports = (io) => {

	// WebSocket handler
	io.on('connection', (socket) => {

		console.log(`${socket.id} user connnected`);

		socket.on('disconnect', function(){
			console.log('user disconnected');
		})

		// listens to vInit emit event
		socket.on('vInit', (data) => {

				if (socket.handshake.session.parent && socket.handshake.session.game) {
					const game = socket.handshake.session.game;

					gameModel.gameActivity( game, (err, rows, fields) => {
						if (err) {
							console.log(`Error: ${err}`);
						}
						else {
								if (!rows) {
									socket.emit('vInit', {success: false, message: 'Sorry! No tags to display'})
								}
								else {
									// store results
									var subject_id = rows[0].subject_id,
											player = rows[0].player_id,
											opponent = rows[0].opponent_id,
											tag_id = rows[0].tag_id;

									// ADD TO SESSION VARIALBLES
									socket.handshake.session.tag_id = tag_id
									socket.handshake.session.sub_id = subject_id

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

									socket.emit('vInit', data)
								}
						}
					})
				}
				else {
					// emit 401 error
					socket.emit('vInit', {success: false, message: 'Unauthorized Access /'})
				}
		})

		// listens to Needed
		socket.on('needed', (data) => {

			if (socket.handshake.session.parent) {
				var parent = socket.handshake.session.parent,
						game = socket.handshake.session.game;

				// Query to get ward_id from guardian tbl
				wsModel.wardId( parent, (err, rows, fields) => {
					if (err) {
						console.log(`Error: ${err}`);
					}
					else {
						if (!rows) {
							// emit RESPONSE
							socket.emit('needed', {success: false})
						}
						else {
							var ward_id = rows[0].ward_id
							// emit RESPONSE
							socket.emit('needed', {success: true})
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
					wsModel.wardId( parent, (err, rows, fields) => {
						if (err) {
							console.log(`Error: ${err}`);
						}
						else {
							if (!rows) {
								// emit RESPONSE
								socket.emit('parent-chatter', {success: false, message: 'Sorry! ward does not exist'})
							}
							else {
								var ward_id = rows[0].ward_id

								// Query to get ward usrname from users tbl
								wsModel.wardUsername( ward_id, (err, rows, fields) => {
									if (err) {
										console.log(`Error: ${err}`);
									}
									else {
										if (!rows) {
											// emit error
											socket.emit('parent-chatter', {success: false})
										}
										else {
											// store result
											var username = rows[0].username;
										}
									}
								})

							}
						}
					})

					// chat logic
					wsModel.getChats(username, parent, (err, rows, fields) => {
						if (err) {
							console.log(`Error: ${err}`);
						}
						else {
							if (rows) {
								// emit response
								socket.emit('parent-chatter', {data: rows[0]})
							}
							else {
								// will emit empty chats
								socket.emit('parent-chatter', {data: rows[0]})
							}
						}
					})
			}
			else {
				// RETURN 401 ERROR
				socket.emit('parent-chatter', {success: false, message: 'Unauthorized Access /'});
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
							console.log(`Error: ${err}`);
						}
						else {
							if (!rows) {
								// emit RESPONSE
								socket.emit('vGameOver', {success: false, message: 'Sorry! There are no games with that key'})
							}
							else {

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
								}
								else if ( o_scores == p_scores ) {
									var opponent = 'Draw';
								}
								else {
									var opponent =  'Lost';
								}

								// player scores logic
								if (o_scores < p_scores) {
									var player = 'Win';
								}
								else if ( o_scores == p_scores ) {
									var player = 'Draw';
								}
								else {
									var player =  'Lost';
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
			else {
				console.log('Unauthorized Access /');
			}
		})

		// vQues
		socket.on('vQues', (data) => {
			if (socket.handshake.session.game && socket.handshake.session.player) {
					var player = socket.handshake.session.player,
							key = socket.handshake.session.game,
							opponent = socket.handshake.session.opponent;

					// Query for question id from vQues tbl
					wsModel.vQues(key, (err, rows, fields) => {
						if (err) {
							console.log(`Error: ${err}`);
						}
						else {
							if (!rows) {
								// emit response
								console.log('Failed to get questions id');
							}
							else {
								// store result
								var sid = rows[0].subject_id,
										qid = rows[0].question_id;
							}
						}
					})

					// Get the actual question
					wsModel.vQuesQues(qid, (err, rows, fields) => {
						if (err) {
							console.log(`Error: ${err}`);
						}
						else {
							if (!rows) {
								// emit response
								console.log('Failed to get questions');
							}
							else {
								// store result
								var question = rows[0].question
							}
						}
					})

					// Get the answers
					wsModel.vQuesAns(qid, (err, rows, fields) => {
						if (err) {
							console.log(`Error: ${err}`);
						}
						else {
							if (!rows) {
								// emit response
								console.log('Failed to get answer');
							}
							else {
								// store result
								var answer = rows[0].answer
							}
						}
					})

					// ADD TO SESSION VARIALBLES
					socket.handshake.session.questions_id = qid
					socket.handshake.session.subject_id = sid

					var data = {
							success: true,
							question: question,
							answer: answer
					}
					// EMIT RESPONSE
					socket.emit('vQues', data);
			}
			else {
				// EMIT 401 ERROR
				socket.emit('vQues', {success: false, message: 'Unauthorized Access /'});
			}

		})

		// get viewers answers
		socket.on('getViewerAns', (data) => {
			if (socket.handshake.session.subject_id && socket.handshake.session.questions_id) {
					var ques_id = socket.handshake.session.questions_id,
							key = socket.handshake.session.game,
							sub_id = socket.handshake.session.subject_id;

					// Get viewers questions id
					wsModel.vGetQues(sub_id, key, (err, rows, fields) => {
						if (err) {
							console.log(`Error: ${err}`);
						}
						else {
							if (!rows) {
								// emit response
								socket.emit('getViewerAns', {question: 'I didnt get anything'});
							}
							else {
								// store result
								var question_id = rows[0].question_id

								// Get the viewers actual question
								wsModel.vGetActualQues(questions_id, (err, rows, fields) => {
									if (err) {
										console.log(`Error: ${err}`);
									}
									else {
										if (!rows) {
											// emit response
											socket.emit('getViewerAns', {success: false, message: 'No questions came'});
										}
										else {
											// store result
											var question = rows[0].question
										}
									}
								})

								// Query to get answers
								wsModel.vQuesAns(questions_id, sub_id, (err, rows, fields) => {
									if (err) {
										console.log(`Error: ${err}`);
									}
									else {
										if (!rows) {
											// emit response
											socket.emit('getViewerAns', {success: false, message: 'No questions came'});
										}
										else {
											// store result in a js array
											var data = [{},{},{},{}];
											data[0].answer = rows[0].option_1
			                data[1].answer = rows[0].option_2
			                data[2].answer = rows[0].option_3
			                data[3].answer = rows[0].answer

											// emit response
											socket.emit('getViewerAns', data);
										}
									}
								})
							}
						}
					})

			}
		})


		// get live data
		socket.on('getLiveData', (data) => {
			var key  = data;

			// get tag
			wsModel.vGetTag(key, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						socket.emit('getLiveData', {success: false, message: 'Sorry! There are no games with that key'});
					}
					else {
						// store result
						var player_id = rows[0].player_id,
								opponent_id = rows[0].opponent_id,
								subject_id = rows[0].subject_id,
								tag_id = rows[0].tag_id;


					}
				}
			})

			// Get question id
			wsModel.GetQuesId(key, subject_id, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						console.log(`Failed to fetch question\'s id`);
					}
					else {
						// store result
						var question_id = rows[0].question_id
					}
				}
			})

			// get questions
			wsModel.GetQues(key, subject_id, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						console.log(`Failed to fetch questions`);
					}
					else {
						// store result
						var question = rows[0].question,
								answer = rows[0].answer
					}
				}
			})

			// Get player 1 fullname
			wsModel.getP1(player_id, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						console.log(`Failed to fetch questions`);
					}
					else {
						// store result
						var p_name = rows[0].fullname
					}
				}
			})

			// Get player 2 fullname
			wsModel.getP2(opponent_id, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						console.log(`Failed to fetch questions`);
					}
					else {
						// store result
						var p2_name = rows[0].fullname
					}
				}
			})

			// Get subjects
			wsModel.getLiveSub(subject_id, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						console.log(`Failed to fetch subjects`);
					}
					else {
						// store results
						var subject = rows[0].subject
					}
				}
			})

			// Get Scores for player 1
			wsModel.getP1Score(player_id, key, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						console.log(`Failed to fetch scores`);
					}
					else {
						// store results
						var correct = rows[0].correct,
								wrong = rows[0].wrong,
								scores = rows[0].scores,
								p_questions = rows[0].questions
					}
				}
			})

			// Get Scores for player 2
			wsModel.getP2Score(opponent_id, key, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						console.log(`Failed to fetch scores`);
					}
					else {
						// store results
						var o_correct = rows[0].correct,
								o_wrong = rows[0].wrong,
								o_scores = rows[0].scores,
								o_questions = rows[0].questions
					}
				}
			})

			// Get player 1 turn from turns tbl
			wsModel.getP1Turn(player_id, tag_id, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						console.log(`Failed to fetch scores`);
					}
					else {
						// store results
						var p1turn = rows[0].is_player
					}
				}
			})

			// Get player 2 turn from turns tbl
			wsModel.getP2Turn(opponent_id, tag_id, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						console.log(`Failed to fetch scores`);
					}
					else {
						// store results
						var p2turn = rows[0].is_player
					}
				}
			})

			// Get viewers from game tbl
			wsModel.getViews(key, (err, rows, fields) => {
				if (err) {
					console.log(`Error: ${err}`);
				}
				else {
					if (!rows) {
						// emit response
						console.log(`Failed to fetch scores`);
					}
					else {
						// store results
						var v_count = rows[0].viewers
					}
				}
			})

			// ADD TO SESSION VARIALBLES
			socket.handshake.session.QID = question_id
			socket.handshake.session.wid = player_id
			socket.handshake.session.game = key

			// EMIT RESPONSE
			var data = {
				o_scores: 	o_scores,
				o_wrong: 		o_wrong,
				o_correct: 	o_correct,
				scores: 		scores,
				wrong: 			wrong,
				correct: 		correct,
				subject: 		subject,
				p2_name: 		p2_name,
				p_name: 		p_name,
				question: 	question,
				p_question: p_questions,
				o_question: o_questions,
				p1_turn: 		p1turn,
				p2_turn: 		p2turn,
				viewers: 		v_count
			}
			socket.emit('getLiveData', data);

		})

		// getLiveAns
		socket.on('getLiveAns', (data) => {
			if (socket.handshake.session.QID) {
				var question_id = socket.handshake.session.QID;

				wsModel.getLiveAns(question_id, (err, rows, fields) => {
					if (err) {
						console.log(`Error: ${err}`);
					}
					else {
						if (!rows) {
							// emit response
							console.log(`Failed to fetch answers`);
						}
						else {
							// store results
							var data = [];
							data['option1'] = rows[0].answer
							data['option2'] = rows[0].option1
							data['option3'] = rows[0].option2
							data['option4'] = rows[0].option3

							// emit response
							socket.emit('getLiveAns', data)
						}
					}
				})

			}
			else {
				// Emit error
				socket.emit('getLiveAns', {message: 'Question id is not set'})
			}
		})

	}) // <==== END OF IO CONNECTION

}
