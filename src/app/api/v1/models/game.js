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
  var sql = `SELECT * from tag where session_key = '${game}' and has_ended = '${false}'`;

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

// const getAns = (callback) => {
//   var sql = `SELECT option_1, option_2, answer, option_3 from answers limit 1`;
//
//   conn.query(sql, (err, rows, fields) => {
//     callback(err, rows, fields)
//   })
// }


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
    opponent_score: opponent_score
    // getAns: getAns
}
