const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/chat',(req,res)=>{
    res.render('chat');
})
app.get('/', (req, res) => {
    res.render('home');
})

let name,picture;

io.on('connection',(socket)=>{
    socket.on('userinfo',(username,profilepic)=>{
        name=username;
        picture=profilepic;
    })
    socket.on('send', (message) => {
        socket.broadcast.emit('userMessage', message,name,picture);
    })

})

server.listen(3000);