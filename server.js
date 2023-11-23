const express = require("express"); //подключили фреймворк

const app = express(); // создание express приложения
const server = require("http").Server(app); //server обращается к app (создание прослойки http)
const io = require("socket.io")(server, {
    //io обращается к server
    cors: {
        origin: "*",
    },
});

app.use(express.json());

const rooms = new Map();

// req - user, res - server

app.get("/rooms", (req, res) => {
    res.json(rooms);
});

app.post("/rooms", (req, res) => {
    const { roomId, userName } = req.body;
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ["users", new Map()]],
            ['messages', []]
            ));
    }
    res.send([...rooms.keys()])
});

// при коннекте пользователя к адресу */rooms - оповещает о подключении
io.on("connection", (socket) => {
    socket.on('ROOM:JOIN', (data)=>{
        console.log(data)
    })

    console.log("user connected", socket.id);
});

server.listen(9999, (err) => {
    if (err) {
        throw Error(err);
    }
    console.log("server running at http://localhost:9999");
});
