const express = require('express')
const app = express()
const { ExpressPeerServer } = require('peer');
const server = require('http').Server(app);
require('dotenv').config()
const io = require('socket.io')(server);
const port = process.env.PORT || 8000
const  { v4: uuidV4} = require('uuid')

// !important! 
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv 

app.set('view engine', 'ejs'); 

app.use(express.static('public'));

app.get('/' , (req , res)=>{

    res.redirect(`/${uuidV4()}`)
 
})

app.get('/:room' , (req , res)=>{
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId);


        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
    
        })
    })
})

const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use('/peerjs', peerServer);


server.listen(port , ()=> console.log('> Server is up and running on port : ' + port))


 