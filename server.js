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
        id: rooms.length, //we shall see if this is necessary
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
    console.log(socket.rooms);

    socket.on("login", data => {
        players.push(data);
        io.emit("login", players);
    });

    socket.on("buzz", data => {
        buzzer = {
            canBuzz: false,
            name: data.name,
            key: data.key
        };
        io.emit("buzz", buzzer);
    });

    socket.on("disconnect", () => {
        let index = -1;
        let players = rooms[socket.rooms[1]].players;
        for (let i = 0; i < players.length; ++i) {
            if (players[i].key === socket.id) {
                index = i;
            }
        }
        if (index >= 0) {
            players[index].disconnected = true;
        }
        io.emit("disconnect", players);
    });
});

let admin = io.of("/admin");
admin.on("connection", socket => {
    //admin only functions
    socket.on("clear", data => {
        buzzer = {
            canBuzz: true,
            name: "",
            key: ""
        };
        io.emit("clear", buzzer);
        admin.emit("clear", buzzer);
    });

    //reset all variables, the game must return to its starting state
    socket.on("reset", () => {
        buzzer = {
            canBuzz: true,
            name: "",
            key: ""
        };
        players = [];
        io.emit("clear", buzzer);
        admin.emit("clear", buzzer);
        io.emit("login", players);
        admin.emit("login", players);
    });
});

//API request to create a room
app.get("/api/room", (req, res) => {
    let newRoomID = rooms.length;
    createRoom();
    res.status(200).send({ id: newRoomID });
});

//initial api requests
app.get("/api/players", (req, res) => {
    console.log(req.params.room);
    res.status(200).send(rooms[req.params.room].players);
});

app.get("/api/buzzer", (req, res) => {
    console.log(req.params);
    res.status(200).send(rooms[req.params.room].buzzer);
});

// Handles any requests that don"t match the ones above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
