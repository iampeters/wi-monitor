const conn = require('../database/db');

// Query the database to check for games with the subject id
const tagger = (subject_id, callback) => {
  var sql = `SELECT * from tag where subject_id = '${subject_id}' and has_ended = '${false}' and is_merged = '0'`;

  conn.query(sql, ( err, rows, fields ) =>{
    callback( err, rows, fields );
  })
}

// Add logged in user as an opponent
const tagger2 = ( logged_in_user_id, randNum, subject_id, callback ) => {
  var sql = `UPDATE tag set opponent_id = '${logged_in_user_id}', session_key = '${randNum}', is_merged = '1' where subject_id = '${subject_id}' and has_ended = '${fal}' and is_merged = '0'`;

  conn.query(sql, ( err, res) => {
    callback( er, res );
  })
}

// Insert into the game table and intialize the game
const gameInsert = ( subject_id, tag_id, randNum, callback ) => {
  var sql = `INSERT into game (game_id, subject_id, tag_id, session_key, has_ended, is_merged) values ('', '${subject_id}', '${tag_id}', '${randNum}', 0, 1)`;

  conn.query(sql, (err, res) => {
    callback(err, res);
  })
}

// Getting back the details of the players
const select_tag = ( randNum, callback ) => {
  var sql = `SELECT * from tag where session_key = '${randNum}' and has_ended = '${false}' and is_merged = 1 `;

  conn.query(sql, (err, rows, fields ) => {
    callback(err, rows, fields);
  })
}

// Getting username of players from users table
const select_users = (p_id, callback) => {
    var sql = `select username, fullname from users where user_id = '${p_id}'`;

    conn.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    })
}

// Getting username of players from users table
const select_users2 = (o_id, callback) => {
    var sql = `select username, fullname from users where user_id = '${o_id}'`;

    conn.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    })
}

// Get the game id
const game_query = (tag_key, callback) => {
    var sql = `SELECT * from game where session_key = '${tag_key}' and is_merged = 1 and has_ended = 0`;

    conn.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    })
}

// Making sure user doesn't already exist
const turn_chk = (tag_id, o_id, callback) => {
    var sql = `select * from turns where tag_id = '${tag_id}' and player_id = '${o_id}'`;

    conn.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    })
}

// Inserting in to the turn table
const turn_insert = (o_id, tag_id, callback) => {
    var sql = `insert into turns (player_id, is_player, tag_id) values ('${o_id}', '0', '${tag_id}')`;

    conn.query(sql, (err, res) => {
        callback(err, res);
    })
}

// # This means the game is ongoing
// # A new game of the same subject would be created
const insert_tagg = (logged_in_user_id, subject_id, callback) => {
    var sql = `INSERT into tag (tag_id, player_id, subject_id, session_key) values ('', '${logged_in_user_id}', '${subject_id}', '') `;

    conn.query(sql, (err, res) => {
        callback(err, res);
    })
}

// # Getting back the tag
const get_tag = (logged_in_user_id, subject_id, callback) => {
    var sql = `select * from tag where player_id = '${logged_in_user_id}' and subject_id = '${subject_id}' and has_ended = '${false}' limit 1 `;

    conn.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    })
}

// Making sure user doesn't already exist
const turn_chk2 = (tid, logged_in_user_id, callback) => {
    var sql = `select * from turns where tag_id = '${tid}' and player_id = '${logged_in_user_id}'`;

    conn.query(sql, (err, rows, fields) => {
        callback(err, rows, fields)
    })
}

// Insert in to the turn table
const turn_insert2 = (tid, logged_in_user_id, callback) => {
    var sql = `insert into turns (player_id, is_player, tag_id) values ('${logged_in_user_id}', '1', '${tid}') `;

    conn.query(sql, (err, res) => {
        callback(err, res)
    })
}

// Query the database for merged users
const query_isMerged = (subject_id, logged_in_user_id, callback) => {
    var sql = `SELECT * from tag where subject_id = '${subject_id}' and ( player_id = '${logged_in_user_id}' OR opponent_id = '${logged_in_user_id}' ) and has_ended = '${false}' and is_merged = 1`;

    conn.query(sql, (err, rows, fields) => {
        callback(err, rows, fields)
    })
}

// # Get all player details and resume the game.
const merged_select_tag = (tagID, callback) => {
    var sql = `SELECT * from tag as T, game as G where (T.tag_id = '${tagID}' and G.tag_id = '${tagID}') and T.subject_id = G.subject_id`;

    conn.query(sql, (err, rows, fields) => {
        callback(err, rows, fields)
    })
}

// # Getting username of players from users table
const merged_select_users = (p_id, callback) => {
  var sql = `select username, fullname from users where user_id = '${p_id}'`;

  conn.query(sql, (err, rows, fields) => {
      callback(err, rows, fields)
  })
}

// # Getting username of opponent from users table
const merged_select_users2 = (o_id, callback) => {
  var sql = `select username, fullname from users where user_id = '${o_id}'`;

  conn.query(sql, (err, rows, fields) => {
      callback(err, rows, fields)
  })
}

// Making sure user doesn't already exist
const merged_turn_chk = (tag_id, o_id, callback) => {
  var sql = `select * from turns where tag_id = '${tag_id}' and player_id = '${o_id}' `;

  conn.query(sql, (err, rows, fields) => {
      callback(err, rows, fields)
  })
}

// Inserting in to the turn table
const merged_turn_insert = (tag_id, o_id, callback) => {
  var sql = `insert into turns (player_id, is_player, tag_id) values ('${o_id}', '0', '${tag_id}')`;

  conn.query(sql, (err, res) => {
      callback(err, res)
  })
}

// # This code will add a new tag with the session subject id
// # if there is no tag with the subject_id
const merged_insert_tag = (logged_in_user_id, subject_id, callback) => {
  var sql = `INSERT into tag (player_id, subject_id) values ('${logged_in_user_id}', '${subject_id}')`

  conn.query(sql, ( err, res ) => {
      callback( err, res );
  })
}

// Getting back the tag
const merged_get_tag = ( logged_in_user_id, subject_id, callback ) => {
  var sql = `select * from tag where player_id = '${logged_in_user_id}' and subject_id = '${subject_id}' and has_ended = '${false}' limit 1`;

  conn.query(sql, ( err, rows, fields ) => {
      callback( err, rows, fields );
  })
}

// Making sure user doesn't already exist
const merged_turn_chk2 = (tid, logged_in_user_id, callback) => {
  var sql = `select * from turns where tag_id = '${tid}' and player_id = '${logged_in_user_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Inserting in to the turn table
const merged_turn_insert2 = (tid, logged_in_user_id, callback) => {
  var sql = ``

  conn.query(sql, (err, res) => {
    callback(err, res);
  })
}

module.exports = {
  tagger: tagger,
  tagger2: tagger2,
  gameInsert: gameInsert,
  select_tag: select_tag,
  select_users: select_users,
  select_users2: select_users2,
  game_query: game_query,
  turn_chk: turn_chk,
  turn_insert: turn_insert,
  insert_tagg: insert_tagg,
  get_tag: get_tag,
  turn_chk2: turn_chk2,
  turn_insert2: turn_insert2,
  query_isMerged: query_isMerged,
  merged_select_tag: merged_select_tag,
  merged_select_users2: merged_select_users2,
  merged_turn_chk: merged_turn_chk,
  merged_turn_insert: merged_turn_insert,
  merged_insert_tag: merged_insert_tag,
  merged_get_tag: merged_get_tag,
  merged_turn_chk2: merged_turn_chk2,
  merged_turn_insert2: merged_turn_insert2
}
