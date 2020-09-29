const express = require("express");
// const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
var id = require("nodejs-unique-numeric-id-generator");
const { send } = require("process");
const port = process.env.PORT || 8085;

app.use(express.static(path.join(__dirname, "./client/build")));

//an array of the rooms created since the server was started
let rooms = [];

//this function should initialize a room for quiz bowl
function createRoom(type) {
    let room = {
        id: id.generate(new Date().toJSON()),
        adminID: "",
        type: type,
        players: [],
        buzzer: {
            canBuzz: true,
            name: "",
            key: ""
        }
    }

    rooms.push(room);

    return room;
}

function destroyRoom(index){
    if(index >= 0){
        rooms.splice(index);
    }
}

function searchRooms(id) {
    let index = -1;
    rooms.forEach(room => {
        if (room.id === id) {
            index = rooms.indexOf(room);
        }
    });

    return index;
}

//socket.io
const options = {
    pingInterval: 500,
    pingTimeout: 10000 //how many seconds before disconnect, we need to keep this somewhat low as an anti-cheating measure
};

const io = require("socket.io")(server, options);
io.on("connection", socket => {
    try {
        socket.on("create", data => {
            let index = searchRooms(data.id);
            socket.join(rooms[index].id);
            rooms[index].adminID = socket.id;
        });

        socket.on("login", data => {
            if (searchRooms(data.id) > -1) {
                let player = {
                    playerID: socket.id,
                    name: data.name,
                    disconnected: false,
                    id: data.id
                };
                rooms[searchRooms(data.id)].players.push(player);
                socket.join(rooms[searchRooms(data.id)].id);
                io.in(data.id).emit("login", rooms[searchRooms(data.id)].players);
            }
        });

        socket.on("buzz", data => {
            let tempRoom = searchRooms(data.id);
            if (rooms[tempRoom].buzzer.canBuzz === true) {
                rooms[tempRoom].buzzer = {
                    canBuzz: false,
                    name: data.name,
                    playerID: socket.id
                };
                io.in(data.id).emit("buzz", rooms[searchRooms(data.id)].buzzer);
            }
        });

        //admin only functions
        socket.on("clear", data => {
            rooms[searchRooms(data.id)].buzzer = {
                canBuzz: true,
                name: "",
                playerID: ""
            };
            io.in(data.id).emit("clear", rooms[searchRooms(data.id)].buzzer);
        });

        //reset all variables, the game must return to its starting state
        socket.on("reset", data => {
            rooms[searchRooms(data.id)].buzzer = {
                canBuzz: true,
                name: "",
                playerID: ""
            };
            rooms[searchRooms(data.id)].players = [];
            io.in(data.id).emit("clear", rooms[searchRooms(data.id)].buzzer);
            io.in(data.id).emit("login", rooms[searchRooms(data.id)].players);
        });

        socket.on("disconnect", data => {
            let index = -1;
            //search for room of player
            let room = -1;
            for (let i = 0; i < rooms.length; ++i) {
                for (let j = 0; j < rooms[i].players.length; ++j) {
                    if (rooms[i].players[j].playerID === socket.id) {
                        room = i;
                        index = j;
                    }
                }
            }

            for(let i = 0; i < rooms.length; ++i) {
                if(rooms[i].adminID === socket.id) {
                    room = i;
                }
            }

            if (index >= 0) {
                rooms[room].players[index].disconnected = true;
            }

            if (room >= 0) {
                io.in(rooms[room].id).emit("disconnect", rooms[room].players);
                
                let gameOver = true;
                rooms[room].players.forEach(player => {
                    if(player.disconnected === false){
                        gameOver = false;
                    }
                });
                if(gameOver){
                    setTimeout(() => {
                        //destroy the room...
                        destroyRoom(room);
                    }, (5 * 60 * 1000)); //...in 5 minutes. (5 * 60 * 10000)ms
                }
            }
        });
    } catch (err) { console.error(err) }
});

//API request to create a room
app.get("/api/room/:type", (req, res) => {
    if (req.params.type === "teams") {
        let newRoomID = createRoom("teams").id;
        return res.status(200).send({
            id: newRoomID,
            type: req.params.type
        });
    } else if (req.params.type === "default") {
        let newRoomID = createRoom("default").id;
        return res.status(200).send({
            id: newRoomID,
            type: req.params.type
        });
    }
});

app.get("/api/roomCount", (req, res) => {
    return res.status(200).send({
        count: rooms.length
    });
});

//get the room type
app.get("/api/roomType/:room", (req, res) => {
    try {
        let index = searchRooms(req.params.room);
        if (index > -1) {
            return res.status(200).send({
                type: rooms[index].type
            });
        } else {
            return res.status(200).send("DNE");
        }
    } catch (err) { console.error(err) };
});

//API request to see if a room exists
app.get("/api/rooms/:room", (req, res) => {
    try {
        let found = false;

        rooms.forEach(room => {
            if (+room.id === +req.params.room) { //+ converts to number type
                found = true;
                res.status(200).send("OK");
            }
        });

        if (found === false) {
            res.status(200).send("DNE");
        }
    } catch (err) { console.error(err) }
});

//initial api requests
app.get("/api/players/:room", (req, res) => {
    try {
        res.status(200).send(rooms[searchRooms(req.params.room)].players);
    } catch (err) { console.error(err) }
});

app.get("/api/buzzer/:room", (req, res) => {
    try {
        res.status(200).send(rooms[searchRooms(req.params.room)].buzzer);
    } catch (err) { console.error(err) }
});

app.get("/api/health", (req, res) => { //for status pages
    res.status(200).send("OK");
});

// Handles any requests that don"t match the ones above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
