const mysql = require('mysql')

// create connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wi-monito'
})

module.exports = conn
