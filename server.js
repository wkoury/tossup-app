const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
var compression = require("compression");
var helmet = require("helmet");

const port = process.env.PORT || 8085;

app.use(compression()); // compress all routes
app.use(helmet()); // add some security
app.use(express.static(path.join(__dirname, "./client/build")));
let players = []; //an array of players connected to the game

//socket.io
const options = { /* ... */ };
const io = require("socket.io")(server, options);
io.on("connection", socket => {
    socket.on("login", data => {
        players.push(data);
        io.emit("login", players);
    });

    socket.on("disconnect", () => {
        //?
    });
});

// Handles any requests that don"t match the ones above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
