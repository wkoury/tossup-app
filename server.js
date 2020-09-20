const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
app.use(bodyParser.json());

const port = process.env.PORT || 8085;

app.use(express.static(path.join(__dirname, "./client/build")));

//an array of the rooms created since the server was started
let rooms = [];

//this function should initialize a room for quiz bowl
function createRoom() {
    rooms.push({
        id: rooms.length,
        players: [],
        buzzer: {
            canBuzz: true,
            name: "",
            key: ""
        }
    });
}

//socket.io
const options = {
    pingInterval: 2000,
    pingTimeout: 5000
};

const io = require("socket.io")(server, options);
io.on("connection", socket => {

    socket.on("create", data => {
        socket.join(rooms[data.room].id);
    });

    socket.on("login", data => {
        rooms[data.room].players.push(data);
        socket.join(rooms[data.room].id);
        io.in(data.room).emit("login", rooms[data.room].players);
    });

    socket.on("buzz", data => {
        rooms[data.room].buzzer = {
            canBuzz: false,
            name: data.name,
            key: data.key
        };
        io.in(data.room).emit("buzz", rooms[data.room].buzzer);
    });

    //admin only functions
    socket.on("clear", data => {
        rooms[data.room].buzzer = {
            canBuzz: true,
            name: "",
            key: ""
        };
        io.in(data.room).emit("clear", rooms[data.room].buzzer);
    });

    //reset all variables, the game must return to its starting state
    socket.on("reset", data => {
        rooms[data.room].buzzer = {
            canBuzz: true,
            name: "",
            key: ""
        };
        rooms[data.room].players = [];
        io.in(data.room).emit("clear", rooms[data.room].buzzer);
        io.in(data.room).emit("login", rooms[data.room].players);
    });

    socket.on("disconnect", () => {
        let index = -1;
        //search for room of player
        let room = -1;
        for (let i = 0; i < rooms.length; ++i) {
            for (let j = 0; j < rooms[i].players.length; ++j) {
                if (rooms[i].players[j].key === socket.id) {
                    room = i;
                    index = j;
                }
            }
        }

        if (index >= 0) {
            rooms[room].players[index].disconnected = true;
        }

        if (room >= 0) {
            io.in(room).emit("disconnect", rooms[room].players);
        }
    });
});

//API request to create a room
app.get("/api/room", (req, res) => {
    let newRoomID = rooms.length;
    createRoom();
    res.status(200).send({ id: newRoomID });
});

//initial api requests
app.get("/api/players/:room", (req, res) => {
    res.status(200).send(rooms[req.params.room].players);
});

app.get("/api/buzzer/:room", (req, res) => {
    res.status(200).send(rooms[req.params.room].buzzer);
});

// Handles any requests that don"t match the ones above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
