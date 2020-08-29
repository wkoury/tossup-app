const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);

const port = process.env.PORT || 8085;

app.use(express.static(path.join(__dirname, "client/build")));

let players = []; //an array of players connected to the game

//socket.io
const options = { /* ... */ };
const io = require("socket.io")(server, options);
io.on("connection", socket => { 
    console.log("User connected.")

    socket.on("disconnect", function(){
        console.log("User disconnected.");
    });
});

app.get("/api/ping", function (req, res) {
    return res.send("Backend connected!");
});

// Handles any requests that don"t match the ones above
app.get("*", (req,res) =>{
    res.sendFile(path.join(__dirname+"/client/build/index.html"));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}.`)
});
