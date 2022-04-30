const express = require("express");
const path = require("path");
const http = require("http");
const https = require("https");
const socket = require("socket.io");
const fs = require("fs");


const app = express();
// const server = http.createServer(app);
// const io = socket(server);

// const users = {}

// app.use(express.static(__dirname));
// io.on('connection', socket => {
//     console.log("New wireless connection"); 
//     socket.on("new-user", user => {
//         users[socket.id] = user
//         socket.broadcast.emit("new_user", user)
//     })

//     socket.on('send-message', message => {
//         console.log(message)
//         socket.broadcast.emit("chat-message", {user:users[socket.id], message:message})
//     })

//     socket.on("disconnect", () => {
//         socket.broadcast.emit("user-disconnected", users[socket.id])
//         delete users[socket.id]
//     })
// });

const Port = process.env.Port || 3000;

// server.listen(Port, () => console.log(`Server running on port ${Port}`));

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
    }, app
)


const io = socket(sslServer);

const users = {}

app.use(express.static(__dirname));
io.on('connection', socket => {
    console.log("New wireless connection"); 
    socket.on("new-user", user => {
        users[String(socket.id)] = user
        console.log(users)
        socket.emit("new_user", {user: user, id: socket.id, users: users})
        socket.broadcast.emit("new_user", {user: user, id: socket.id, users: users})
    })

    socket.on('send-message', message => {
        console.log(message)
        socket.broadcast.emit("chat-message", {user:users[socket.id], message:message})
    })

    socket.on("disconnect", () => {
        delete users[String(socket.id)]
        socket.broadcast.emit("user-disconnected", {user_disconnected: users[socket.id], users: users})
    })
});




sslServer.listen(Port, () => {
    console.log("Secure ssl server created");
})
