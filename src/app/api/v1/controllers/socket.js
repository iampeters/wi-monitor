const gameModel = require('../models/game')
const userModel = require('../models/users')
const wsModel = require('../models/socket')
const socket = require('socket.io')

module.exports = (server) => {

const io = socket(server);

// WebSocket handler
io.on('connection', (socket) => {
    console.log('a user connnected')
})

// get the chat msg
io.on('chat', (msg) => {
    io.emit('res', json.stringify(msg))
})

}


