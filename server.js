const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
app.use(bodyParser.json());

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

const ADMIN_PASSWORD = "chonka1";

//socket.io
const options = {
    pingInterval: 2000,
    pingTimeout: 5000
};
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
    });

    //reset all variables, the game must return to its starting state
    socket.on("reset", () => {
        buzzer = {
            canBuzz: true,
            name: ""
        };
        players = [];
        io.emit("clear", buzzer);
        io.emit("login", players);
    });

    // socket.on("disconnect", data => {
    //     console.log(data);
    //     let index = players.indexOf(data);
    //     if (index >= 0) {
    //         players.splice(index, 1);
    //     }
    //     io.emit("disconnect", players);
    // });
});

//initial api requests
app.get("/api/players", (req, res) => {
    res.status(200).send(players);
});

app.get("/api/buzzer", (req, res) => {
    res.status(200).send(buzzer);
});

app.post("/api/admin", (req, res) => {
    if(req.body.password===ADMIN_PASSWORD){
        return res.status(200).send("yes");
    }else{
        return res.status(200).send("no");
    }
});

// Handles any requests that don"t match the ones above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
