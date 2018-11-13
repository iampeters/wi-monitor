const conn = require('../database/db')

// leaderboard
const leaderboard = (callback) => {
    //sql
    var sql = `SELECT * from points ORDER BY points DESC limit 2 `;

    conn.query(sql, (err, rows, fields) => {

        callback(err, rows, fields)
    })
}

// get Subjects
const getSubjects = (callback) => {
  var sql = `SELECT  subject, subject_id from Subjects`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields);
  })
}

// get questions
const getQuestions = ( id, callback ) => {
  var sql = `select subject from Subjects where subject_id = '${id}'`;

  conn.query(sql, ( err, rows, fields ) => {
    callback( err, rows, fields );
  })
}


// get games
const getGame = (callback) => {
  var sql = `SELECT session_key from game where has_ended = 0`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get game activity
const gameActivity = (game, callback) => {
  var sql = `SELECT * from tag where session_key = '${game}' and has_ended = 'false'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// getting player names
const p_name = (player, callback) => {
  var sql =  `SELECT * from users where user_id = '${player}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// getting opponent names
const o_name = (opponent, callback) => {
  var sql =  `SELECT * from users where user_id = '${opponent}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get subject
const subj = (subject_id, callback) => {
  var sql =  `SELECT subject from Subjects where subject_id = '${subject_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get game
const viewers = (game, callback) => {
  var sql =  `SELECT viewers from game where session_key = '${game}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get player turn
const turns_p_query = (tag_id, player, callback) => {
  var sql =  `SELECT is_player from turns where tag_id = '${tag_id}' and player_id = '${player}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get opponent turn
const turns_o_query = (tag_id, opponent, callback) => {
  var sql =  `SELECT is_player from turns where tag_id = '${tag_id}' and player_id = '${opponent}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get player scores
const player_score = (player, game, callback) => {
  var sql =  `SELECT * from scores where player_id = '${player}' and session_key = '${game}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get opponent scores
const opponent_score = (opponent, game, callback) => {
  var sql =  `SELECT * from scores where player_id = '${opponent}' and session_key = '${game}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get current question count
const quesCount = (uid, key, callback) => {
  var sql = `SELECT questions from scores where player_id = '${uid}' and session_key = '${key}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Update questions column
const updateScores = (newVal, uid, key, callback) => {
  var sql = `UPDATE scores set questions = '${newVal}' where session_key = '${key}' and player_id = '${uid}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get answers with the ques_id and choice
const getChoiceAns = (ques_id, choice, callback) => {
  var sql = `SELECT answer from questions where questions_id = '${ques_id}' and answer = '${choice}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get the current value of the user's correct answers
const getCorVal = (player_id, key, callback) => {
  var sql = `SELECT correct, scores from scores where player_id = '${player_id}' and session_key = '${key}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// update scores tbl with the current value of the correct choices
const ScoresUpdate = (player_id, new_scores, new_value, callback) => {
  var sql = `UPDATE scores set correct = '${new_value}', scores = '${new_scores}', timer = 0 where player_id = '${player_id}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Inserting the current value of the correct choices
const ScoresInsert = (player_id, right, score, gid, tid, sid, key, callback) => {
  var sql = `INSERT into scores (score_id, player_id, correct, scores, game_id, tag_id, subject_id, session_key, timer) values ('', '${player_id}', '${right}', '${score}', '${gid}', '${tid}','${sid}', '${key}', 0) `;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Get the current value of the user's wrong answers
const getWrongVal = (player_id, key, callback) => {
  var sql = `SELECT wrong from scores where player_id = '${player_id}' and session_key = '${key}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Update scores tbl with the current value of the wrong choice
const UpdateWrong = (new_value, player_id, callback) => {
  var sql = `UPDATE scores set wrong = '${new_value}' WHERE player_id = '${player_id}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Inserting the current value of the wrong choice
const insertWrong = (wrong, player_id, gid, tid, sid, key, callback) => {
  var sql = `INSERT into scores (score_id, player_id, wrong, game_id, tag_id, subject_id, session_key) values ('', '${player_id}', '${wrong}', '${gid}', '${tid}','${sid}', '${key}')`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Query 1
const generator = (sid, callback) => {
  var sql = `SELECT * from questions where subject_id = '${sid}' order by rand() limit 1`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// getting available options
const generatorOptions = (Qid, callback) => {
  var sql = `SELECT * from answers where question_id = ${Qid}`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Inserting into vQues tbl
const genvQuesIns = (Qid, key, sid, callback) => {
  var sql = `INSERT INTO vQues values(null, '${sid}', '${Qid}', '${key}')`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Getting players from the tag table
const getSetterTag = (tid, callback) => {
  var sql = `select * from tag where tag_id = '${tid}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Getting the user id from the database
const setterUserChk = (db_player_id, tid, callback) => {
  var sql = `select * from turns where player_id = '${db_player_id}' and tag_id = '${tid}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Updating the tbl to false if the tbl value is true
const Turnsetter = (chk_p_id, tid, callback) => {
  var sql = `update turns set is_player = '0' where player_id = '${chk_p_id}' and tag_id = '${tid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Updating the opponent
const TurnsetterOpp = (db_opponent_id, tid, callback) => {
  var sql = `update turns set is_player = '1' where player_id = '${db_opponent_id}' and tag_id = '${tid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Updating the tbl to true if the tbl value is false
const TurnsetterP1 = (chk_p_id, tid, callback) => {
  var sql = `update turns set is_player = '1' where player_id = '${chk_p_id}' and tag_id = '${tid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Updating the tbl to true if the tbl value is false
const TurnsetterP2 = (db_opponent_id, tid, callback) => {
  var sql = `update turns set is_player = '0' where player_id = '${db_opponent_id}' and tag_id = '${tid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Getting the user id from the database
const setterUserChk2 = (db_opponent_id, tid, callback) => {
  var sql = `select * from turns where player_id = '${db_opponent_id}' and tag_id = '${tid}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Updating the tbl to false if the tbl value is true
const Turnsetter2 = (chk_p_id, tid, callback) => {
  var sql = `update turns set is_player = '0' where player_id = '${chk_p_id}' and tag_id = '${tid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Updating the opponent
const TurnsetterOpp2 = (db_player_id, tid, callback) => {
  var sql = `update turns set is_player = '1' where player_id = '${db_player_id}' and tag_id = '${tid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Updating the tbl to true if the tbl value is false
const TurnsetterP1_2 = (chk_p_id, tid, callback) => {
  var sql = `update turns set is_player = '1' where player_id = '${chk_p_id}' and tag_id = '${tid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Updating the opponent
const TurnsetterOpp2_2 = (db_player_id, tid, callback) => {
  var sql = `update turns set is_player = '0' where player_id = '${db_player_id}' and tag_id = '${tid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Updating scores
const unsetScoreUpdate = (id, key, username, callback) => {
  var sql = `UPDATE scores set gave_up = '${username}' where player_id = '${id}' and session_key = '${key}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Updating tag
const unsetTagUpdate = (key, callback) => {
  var sql = `UPDATE tag set has_ended = 'true' where session_key = '${key}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Updating game
const unsetGameUpdate = (key, callback) => {
  var sql = `UPDATE game set has_ended = true where session_key = '${key}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Query to get guardian from guardian tbl 2
const chkGuard = (uid, callback) => {
  var sql = `SELECT username from guardian where ward_id = '${uid}' and needed = 0`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// guadian chat update
const GuardUpdate = (uid, g_uname, callback) => {
  var sql = `UPDATE guardian set needed = 1 where username = '${g_uname}' and ward_id = '${uid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Query to get guardian from guardian tbl
const chkGuard2 = (uid, callback) => {
  var sql = `SELECT username from guardian where ward_id = '${uid}' and needed = 1`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// guadian chat update 2
const GuardUpdate2 = (uid, g_uname, callback) => {
  var sql = `UPDATE guardian set needed = 0 where username = '${g_uname}' and ward_id = '${uid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// Query guardian table
const chatGuardChk = (uid, callback) => {
  var sql = `SELECT id, username from guardian where ward_id = '${uid}' and needed = 1`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// insert into the chat table
const chatInsert = (username, g_uname, key, message, callback) => {
  var sql = `INSERT INTO chat values(null, '${username}', '${g_uname}', '${key}', '${message}')`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// update needed in chat guardian tbl
const chatUpdate = (g_uname, uid, callback) => {
  var sql = `UPDATE guardian set needed = 1 where username = '${g_uname}' and ward_id = '${uid}'`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}


// Exports
module.exports = {
    leaderboard: leaderboard,
    subjects: getSubjects,
    questions: getQuestions,
    getGame: getGame,
    gameActivity: gameActivity,
    p_name: p_name,
    o_name: o_name,
    subj: subj,
    viewers: viewers,
    turns_p_query: turns_p_query,
    turns_o_query: turns_o_query,
    player_score: player_score,
    opponent_score: opponent_score,
    quesCount: quesCount,
    updateScores: updateScores,
    getChoiceAns: getChoiceAns,
    getCorVal: getCorVal,
    ScoresUpdate: ScoresUpdate,
    ScoresInsert: ScoresInsert,
    getWrongVal: getWrongVal,
    UpdateWrong: UpdateWrong,
    insertWrong: insertWrong,
    generator: generator,
    generatorOptions: generatorOptions,
    genvQuesIns: genvQuesIns,
    getSetterTag: getSetterTag,
    setterUserChk: setterUserChk,
    Turnsetter: Turnsetter,
    TurnsetterOpp: TurnsetterOpp,
    TurnsetterP1: TurnsetterP1,
    TurnsetterP2: TurnsetterP2,
    setterUserChk2: setterUserChk2,
    Turnsetter2: Turnsetter2,
    TurnsetterOpp2: TurnsetterOpp2,
    TurnsetterP1_2: TurnsetterP1_2,
    TurnsetterOpp2_2: TurnsetterOpp2_2,
    unsetScoreUpdate: unsetScoreUpdate,
    unsetTagUpdate: unsetTagUpdate,
    unsetGameUpdate: unsetGameUpdate,
    chkGuard: chkGuard,
    GuardUpdate: GuardUpdate,
    chkGuard2: chkGuard2,
    GuardUpdate2: GuardUpdate2,
    chatGuardChk: chatGuardChk,
    chatInsert: chatInsert,
    chatUpdate: chatUpdate
}
