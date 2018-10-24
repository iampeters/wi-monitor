const conn = require('../database/db')

// user login
const login = (username, password, callback) => {
    var uname = username
    var pass = password

    //sql
    var sql = `select username, fullname, user_id from users where username = "${uname}" and password = "${pass}" `

    conn.query(sql, (err, rows, fields) => {
        callback(err, rows, fields)
    })
}

// register user
const register = (username, fullname, password, callback) => {
    // query
    sql = `insert into users (user_id, username, fullname, password) values(null, "${username}", "${fullname}", "${password}")`
    conn.query(sql, (err, res) => {
        callback(err, res);
    })

}


module.exports = {
    login: login,
    register: register
}