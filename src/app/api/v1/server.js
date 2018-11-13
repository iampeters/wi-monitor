const express = require('express')
const http = require('http')
const dotenv = require('dotenv').config();
const userController = require('./controllers/users')
const gameController = require('./controllers/game')
const adminController = require('./controllers/admin')
const taggerController = require('./controllers/tagger')
const parentController = require('./controllers/parent')
const webSocket = require('./controllers/socket')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const socket = require('socket.io')
const session = require('express-session')({ secret: 'sfkfjksljfsdfji848iosdl382iorc83wueewksd8998', resave: true, saveUninitialized: true })
const sharedSession = require('express-socket.io-session')



const app = express();

// Use express-session middleware for express
app.use(session)

// Http headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "http://localhost:4200")
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE")
    res.header('Access-Control-Allow-Headers', "Content-Type, origin, x-requested-with, Accept")
    res.header('Access-Control-Allow-Credentials', true)
    next();
})

const server = http.Server(app)

const io = socket(server)

// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedSession(session, {
    autoSave: true
}))


// Fire controllers
userController(app);
gameController(app);
adminController(app);
taggerController(app);
parentController(app);
webSocket(io);


var port = process.env.PORT || 3000;

// listener
server.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});
