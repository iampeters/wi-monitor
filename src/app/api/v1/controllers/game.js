const gameModel = require('../models/game')
const userModel = require('../models/users')
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded(({extended: false}));

module.exports = (app) => {
    
    app.get('/', (req, res) => {
        res.send('Welcome to Nodejs, Expressjs and Socket.io application')
        res.end()
    })
}