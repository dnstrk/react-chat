const express = require("express"); //подключили фреймворк

const app = express(); // создание express приложения
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

const rooms = new Map();

// req - user, res - server
app.get("/rooms", (req, res) => {
    res.json(rooms);
});

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
});

server.listen(9999, (err) => {
    if (err) {
        throw Error(err);
    }
    console.log("server running at http://localhost:9999");
});
