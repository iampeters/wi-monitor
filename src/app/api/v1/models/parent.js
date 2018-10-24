const conn = require('../database/db')

// parent login
const wardChk = (ward, callback) => {
  var sql = `SELECT * from users where username = '${ward}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })

}

// Checking if this guardian is associated with the ward
// log user in if true
const login = (username, user_id, callback) => {
  var sql = `SELECT id, username, ward_id from guardian where username ='${username}' and ward_id = '${user_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get ward_id
const getWardId = (parent, callback) => {
  var sql = `SELECT ward_id from guardian where username = '${parent}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// get wards username
const getWardUsername = (ward_id, callback) => {
  var sql = `SELECT username from users where user_id = '${ward_id}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// insert into chat tbl
const chatInsert = (parent, ward, key, message, callback) => {
  var sql = `INSERT INTO chat values('', '${parent}', '${ward}', '${key}', '${message}') `;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}


// exports
module.exports = {
  ward: wardChk,
  login: login,
  getWardId: getWardId,
  getWardUsername: getWardUsername,
  chatInsert: chatInsert
}
