const express = require('express')
const http = require('http')
const session = require('express-session')({ secret: "sfkfjksl-jfsdfji-848iosdl382-iorc83wu-eewksd8998", resave: true, saveUninitialized: true })
const userController = require('./controllers/users')
const gameController = require('./controllers/game')
const adminController = require('./controllers/admin')
const taggerController = require('./controllers/tagger')
const parentController = require('./controllers/parent')
const webSocket = require('./controllers/socket')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const socket = require('socket.io')
const sharedSession = require('express-socket.io-session')



const app = express();

//session
app.use(session)

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "http://localhost:4200")
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE")
    res.header('Access-Control-Allow-Headers', "Content-Type, origin, x-requested-with, Accept")
    res.header('Access-Control-Allow-Credentials', true)
    next();
})

const server = http.Server(app)
const io = socket(server, { cookie: true })

io.use(sharedSession(session))


// Fire controllers
userController(app);
gameController(app);
adminController(app);
taggerController(app);
parentController(app);
webSocket(io);



// listener
server.listen(3000, () => {
    console.log('Server listening to port 3000');
});
