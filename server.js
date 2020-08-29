const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);

const port = process.env.PORT || 8085;

app.use(express.static(path.join(__dirname, "./client/build")));

//an array of players connected to the game
let players = []; 

//an object representing whether or not the buzzer is locked
//and the name of the player who buzzed first
let buzzer = {
    canBuzz: true,
    name: ""
};

//socket.io
const options = { /* ... */ };
const io = require("socket.io")(server, options);
io.on("connection", socket => {
    socket.on("login", data => {
        players.push(data);
        io.emit("login", players);
    });

    socket.on("buzz", data => {
        buzzer.name = data;
        buzzer.canBuzz = false;
        io.emit("buzz", buzzer);
    });

    socket.on("clear", data => {
        buzzer.canBuzz = true;
        io.emit("clear", buzzer);
    })
});

//initial api requests
app.get("/api/players", (req, res) => {
    res.status(200).send(players);
});

app.get("/api/buzzer", (req, res) => {
    res.status(200).send(buzzer);
})

// Handles any requests that don"t match the ones above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
