const conn = require('../database/db')

// login
const login = (email, password, callback) => {
    // sql
    var sql = `SELECT username, email from admin where ( username = '${email}' or email = '${email}') and password = '${password}'`;

    conn.query(sql, (err, rows, fields) => {
      callback(err, rows, fields)
    })
}

// get Wards
const wards = (callback) => {
  var sql = `select username, user_id from users`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// add subjects
const addSubject = (subject, callback) => {
  var sql = `insert into Subjects (subject) values('${subject}')`;
  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// add questions
const addQuestion = (question, subject, answer, callback) => {
  var sql = `insert into questions (subject_id, question, answer ) values('${subject}', '${question}', '${answer}')`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

// get back the question id
const query1 = (question, callback) => {
  var sql = `select questions_id from questions where question ='${question}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// insert into answers table
const query2 = ( question_id, subject, option1, option2, option3, answer, callback) => {
  var sql = `insert into answers (subject_id, question_id, option_1, option_2, option_3, answer) values ('${subject}','${question_id}','${option1}','${option2}','${option3}','${answer}')`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}

const chkGuardian = (username, callback) => {
  var sql = `SELECT username from guardian where username = '${username}'`;

  conn.query(sql, (err, rows, fields) => {
    callback(err, rows, fields)
  })
}

// Inserting new guardian if username is available
const addGuardian = (guardian, ward, relationship, phone, email, username, callback) => {
  var sql = `INSERT INTO guardian Values('', '${username}', '${ward}', '${guardian}', '${email}','${phone}','${relationship}', 0)`;

  conn.query(sql, (err, res) => {
    callback(err, res)
  })
}


// EXPORTS
module.exports = {
    login: login,
    wards: wards,
    addSubject: addSubject,
    addQuestion: addQuestion,
    query1: query1,
    query2: query2,
    chkGuardian: chkGuardian,
    addGuardian: addGuardian
}
