const express = require('express')
const http = require('http')
const session = require('express-session')
const userController = require('./controllers/users')
const gameController = require('./controllers/game')
const webSocket = require('./controllers/socket')

const app = express();

//session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//set the headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "http://localhost:4200")
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE")
    res.header('Access-Control-Allow-Headers', "Content-Type")
    next();
})

// http server
const server = http.Server(app);

// Fire controllers
// userController(app);
gameController(app);
webSocket(server);



// listener
server.listen(3000, () => {
    console.log('Server listening to port 3000');
});