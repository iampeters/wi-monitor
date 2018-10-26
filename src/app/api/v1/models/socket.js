const conn = require('../database/db')

// GET WARD ID FROM GUARDIAN
const getWardId = (parent, callback) => {
  var sql = `SELECT ward_id from guardian where username = '${parent}' and needed = 1 `;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Query to get ward usrname from users tbl
const getWardUsername = (ward_id, callback) => {
  var sql = `SELECT username from users where user_id = '${ward_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// chat logic
const getChat = (username, parent, callback) => {
  var sql = `SELECT * from chat where (sender = '${username}' and receiver = '${parent}' ) or (sender = '${parent}' and receiver = '${username}' )`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get tag
const getTag = (key, callback) => {
  var sql = `SELECT * from scores where session_key = '${key}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Query for questions id from vQues tbl
const vQues = (key, callback) => {
  var sql = `SELECT * from vQues where session_key = '${key}' order by id desc limit 1 `;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get the actual question
const vQuesQues = (qid, callback) => {
  var sql = `SELECT question from questions where questions_id = '${qid}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get the answers
const vQuesAns = (qid, callback) => {
  var sql = `SELECT * from answers where question_id = '${qid}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get viewers questions id
const vGetQues = (key, sub_id, callback) => {
  var sql = `SELECT question_id from vQues where session_key = '${key}' and subject_id = '${sub_id}' order by id desc limit 1 `;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get the viewers actual question
const vGetActualQues = (questions_id, callback) => {
  var sql = `SELECT question from questions where questions_id = '${questions_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Query to get answers
const vGetAns = (questions_id, sub_id, callback) => {
  var sql = `SELECT option_1, option_2, answer, option_3 from answers where question_id = '${question_id}' and subject_id = '${sub_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get tag
const vGetTag = (key, callback) => {
  var sql = `SELECT * from tag where session_key = '${key}' and has_ended = '${false}' `;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get question id
const GetQuesId = (key, subject_id, callback) => {
  var sql = `SELECT * FROM vQues WHERE session_key = '${key}' and subject_id = '${subject_id}'  order by id desc limit 1 `;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get questions
const GetQues = (question_id, subject_id, callback) => {
  var sql = `SELECT * from questions where questions_id = '${question_id}' and subject_id = '${subject_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get player 1 fullname
const getP1 = (player_id, callback) => {
  var sql = `select fullname from users where user_id = '${player_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get player 2 fullname
const getP2 = (opponent_id, callback) => {
  var sql = `select fullname from users where user_id = '${opponent_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}






// WHEN THE CHAT IS OPEN
const open = (uid, callback) => {
  var sql = `SELECT username from guardian where ward_id = '${uid}'  `;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// WHEN THE CHAT IS CLOSED
const closed = (uid, callback) => {
  var sql = `SELECT username from guardian where ward_id = '${uid}' `;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}




// Get subjects
const getLiveSub = (subject_id, callback) => {
  var sql = `select subject from Subjects where subject_id = '${subject_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}


// Get Scores for player 1
const getP1Score = (player_id, key, callback) => {
  var sql = `select * from scores where session_key = '${key}' and player_id = '${player_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get Scores for player 1
const getP2Score = (opponent_id, key, callback) => {
  var sql = `select * from scores where session_key = '${key}' and player_id = '${opponent_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get player 1 turn from turns tbl
const getP1Turn = (player_id, tag_id, callback) => {
  var sql = `SELECT is_player from turns where tag_id = '${tag_id}' and player_id = '${player_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get player 2 turn from turns tbl
const getP2Turn = (opponent_id, tag_id, callback) => {
  var sql = `SELECT is_player from turns where tag_id = '${tag_id}' and player_id = '${opponent_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get viewers from game tbl
const getViews = (key, callback) => {
  var sql = `SELECT viewers from game where session_key = '${key}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get live views answers
const getLiveAns = (question_id, callback) => {
  var sql = `select * from answers where question_id = '${question_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get some questions
const getQuizSubId = (id, callback) => {
  var sql = `SELECT * from questions where subject_id = ${id}  order by rand() limit 1`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// getting available options
const getAvailOpt = (Qid, callback) => {
  var sql = `SELECT * from answers where question_id = ${Qid}`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// getting quiz options
const getQuizOpt = (sub_id, question_id, callback) => {
  var sql = `SELECT option_1, option_2, answer, option_3 from answers where question_id = '${question_id}' and subject_id = '${sub_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Inserting into vQues tbl
const vQuesInsert = (Qid, id, key, callback) => {
  var sql = `INSERT INTO vQues values(null, '${id}', '${Qid}', '${key}')`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// get quiz qid
const getQuizQid = (sub_id, key, callback) => {
  var sql = `SELECT question_id from vQues where session_key = '${key}' and subject_id = '${sub_id}' order by id desc limit 1 `;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get quiz actual question
const getQuizActualQues = (question_id, callback) => {
  var sql = `SELECT question from questions where questions_id = '${question_id}' `;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get all turns from tbl
const getAllFrmTurn = (tid, uid, callback) => {
  var sql = `select * from turns where tag_id ='${tid}' and player_id ='${uid}' `;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get the current value of the user's correct answers
const getUserCorrectScores = (key, player_id, callback) => {
  var sql = `SELECT correct, wrong, questions, scores from scores where player_id = '${player_id}' and session_key = '${key}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get the current value of the user's correct answers
const getOppScores = (key, uid, callback) => {
  var sql = `SELECT * from scores where session_key = '${key}' and player_id != '${uid}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Get viewers the current game
const getViewers = (key, callback) => {
  var sql = `SELECT viewers from game where session_key = '${key}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}


// Query id and username from guardian tbl
const getUserInfo = (uid, callback) => {
  var sql = `SELECT id, username from guardian where ward_id = '${uid}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}


// Query chats from the chat tbl
const getAllChats = (g_uname, username, callback) => {
  var sql = `SELECT * from chat where (sender = '${username}' and receiver = '${g_uname}' ) or (sender = '${g_uname}' and receiver = '${username}')`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}




// Exports
module.exports = {
  wardId: getWardId,
  onOpen: open,
  onClosed: closed,
  wardUsername: getWardUsername,
  getChats: getChat,
  getTag: getTag,
  vQues: vQues,
  vQuesQues: vQuesQues,
  vQuesAns: vQuesAns,
  vGetQues: vGetQues,
  vGetActualQues: vGetActualQues,
  vGetAns: vGetAns,
  vGetTag: vGetTag,
  GetQuesId: GetQuesId,
  GetQues: GetQues,
  getP1: getP1,
  getP2: getP2,
  getLiveAns: getLiveAns,
  getLiveSub: getLiveSub,
  getP1Score: getP1Score,
  getP2Score: getP2Score,
  getP2Turn: getP2Turn,
  getP1Turn: getP1Turn,
  getViews: getViews,
  getQuizSubId: getQuizSubId,
  getAvailOpt: getAvailOpt,
  vQuesInsert: vQuesInsert,
  getQuizQid: getQuizQid,
  getQuizActualQues: getQuizActualQues,
  getQuizOpt: getQuizOpt,
  getAllFrmTurn: getAllFrmTurn,
  getUserCorrectScores: getUserCorrectScores,
  getOppScores: getOppScores,
  getViewers: getViewers,
  getUserInfo: getUserInfo,
  getAllChats: getAllChats
}
