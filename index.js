const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const users = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.use(express.static(__dirname + '/assets'))

io.on('connection', (socket) => {
    if(users.length < 2) {
        users.push(socket.id)
        if(users.length == 2) {
            io.emit('waiting')
        }
    }
    socket.on('index', (data) => {
        if(users[0] == socket.id && users.length == 2) {
            users.reverse()
            io.emit('message', {
                index: data.index
            })
        }
    })
    socket.on('disconnect', () => {
        if(socket.id == users[0]) {
            users.splice(0, 1)
        }
        else if (socket.id == users[1]) {
            users.splice(1, 1)
        }
        if (users.length < 2) {
            io.emit('reset')
            io.emit('waiting2')
        }
    })
    socket.on('reset', () => {
        io.emit('reset')
    })
    
})


http.listen(3000, () => {
    console.log('server startanul')
})