const express = require("express"); //подключили фреймворк

const cors = require("cors");

const app = express(); // создание express приложения
const server = require("http").Server(app); //server обращается к app (создание прослойки http)
const io = require("socket.io")(server, {
    //io обращается к server
    cors: {
        origin: "*",
    },
});

app.use(express.json());
app.use(cors());

const rooms = new Map();

// req - user, res - server

app.get("/rooms/:id", (req, res) => {
    const { id: roomId } = req.params;
    const obj = rooms.has(roomId)
        ? {
              users: [...rooms.get(roomId).get("users").values()],
              messages: [...rooms.get(roomId).get("messages").values()],
          }
        : { users: [], messages: [] };
    res.json(obj);
});

app.post("/rooms", (req, res) => {
    const { roomId, userName } = req.body;
    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ["users", new Map()],
                ["messages", []],
            ])
        );
    }
    res.send();
});

// при коннекте пользователя к адресу */rooms - оповещает о подключении
io.on("connection", (socket) => {
    socket.on("ROOM:JOIN", ({ roomId, userName }) => {
        socket.join(roomId);
        rooms.get(roomId).get("users").set(socket.id, userName);
        const users = [...rooms.get(roomId).get("users").values()];
        socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
    });

    socket.on("ROOM:NEW_MESSAGE", ({ roomId, userName, text }) => {
        const obj = {
            userName,
            text,
        };
        rooms.get(roomId).get("messages").push(obj);
        socket.broadcast.to(roomId).emit("ROOM:NEW_MESSAGE", obj);
    });

    socket.on("ROOM:CLEAR_CHAT", ({ roomId }) => {
        
        rooms.get(roomId).set("messages", [])    
        socket.broadcast.to(roomId).emit("ROOM:CLEAR_CHAT");
    });

    socket.on("disconnect", () => {
        rooms.forEach((value, roomId) => {
            if (value.get("users").delete(socket.id)) {
                const users = [...rooms.get(roomId).get("users").values()];
                socket.to(roomId).emit("ROOM:SET_USERS", users);
            }
        });
    });

    // console.log("user connected", socket.id);
});

server.listen(9999, (err) => {
    if (err) {
        throw Error(err);
    }
    console.log("server running at http://localhost:9999");
});
