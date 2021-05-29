const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
var id = require("nodejs-unique-numeric-id-generator");
const port = process.env.PORT || 8085;
const fs = require("fs");
require("dotenv").config();

/** START SERVER ROUTES */

// React SPA
app.use(express.static(path.join(__dirname, "./client/build")));

// Other routes
//Config
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", { layout: false });
//serve style sheets from client
app.use(express.static("./client/src/"));

//dashboard
app.get("/dashboard", (req, res) => {
	res.render("dashboard");
});

/** END SERVER ROUTES */

//whether or not we should be printing things to the console
const log = true;

//an array of the rooms created since the server was started
let rooms = [];

//the number of rooms created since the last server start
let roomsCreated = 0;

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
			playerID: ""
		},
		score: {
			team1: 0,
			team2: 0
		},
		names: {
			team1: "Team 1",
			team2: "Team 2"
		},
		canSwitchTeams: true
	}

	if (log) {
		logStatement("Creating a new room.");
		logStatement(room);
	}

	rooms.push(room);

	if (log) {
		logStatement("Rooms array:");
		logStatement(rooms);
	}

	return room;
}

function destroyRoom(index) {
	if (index >= 0) {
		io.in(rooms[index].id).emit("kill");
		rooms.splice(index);
	}
}

function searchRooms(id) {
	if (log) {
		logStatement("Searching for room ", id);
		logStatement("Rooms array:");
		logStatement(rooms);
	}
	let index = -1;
	rooms.forEach(room => {
		if (log) {
			logStatement("Search id: ", id);
			logStatement("Room id at index ", rooms.indexOf(room), ": ", room.id);
		}
		if (room.id === id) {
			index = rooms.indexOf(room);
		}
	});

	return index;
}

async function logStatement(text) {
	const writeable = new Date() + ": " + text + "\n";
	console.log(text);
}

//socket.io
const options = {
	pingInterval: 1000,
	pingTimeout: 60000
};

const io = require("socket.io")(server, options);
io.on("connection", socket => {
	socket.on("create", data => {
		let index = searchRooms(data.id);
		socket.join(rooms[index].id);
		rooms[index].adminID = socket.id;
		roomsCreated++;
	});

	socket.on("login", data => {
		if (searchRooms(data.id) > -1) {
			let player = {
				playerID: socket.id,
				name: data.name,
				disconnected: false,
				id: data.id,
				team1: true
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

	socket.on("score", data => {
		rooms[searchRooms(data.id)].score.team1 = data.team1;
		rooms[searchRooms(data.id)].score.team2 = data.team2;
		io.in(data.id).emit("score", rooms[searchRooms(data.id)].score);
	});

	socket.on("name", data => {
		rooms[searchRooms(data.id)].names.team1 = data.team1;
		rooms[searchRooms(data.id)].names.team2 = data.team2;
		io.in(data.id).emit("name", rooms[searchRooms(data.id)].names);
	});

	socket.on("switch", data => {
		if (log) {
			logStatement(`Team switch requested in room ${data.id}`);
		}
		rooms[searchRooms(data.id)].players.find(p => p.playerID === data.playerID).team1 = !rooms[searchRooms(data.id)].players.find(p => p.playerID === data.playerID).team1;
		io.in(data.id).emit("switch", rooms[searchRooms(data.id)].players);
	});

	socket.on("lock", data => {
		if (log) {
			logStatement(`Team switching toggled in room ${data.id}`);
		}
		rooms[searchRooms(data.id)].canSwitchTeams = !rooms[searchRooms(data.id)].canSwitchTeams;
		io.in(data.id).emit("lock", rooms[searchRooms(data.id)].canSwitchTeams);
	});

	// handle an Admin removing a player
	socket.on("remove", data => {
		if (log) {
			logStatement(`Admin has removed player ${data.playerID} in room ${data.id}`);
		}
		const roomIndex = searchRooms(data.id);
		for (let ii = 0; ii < rooms[roomIndex].players.length; ++ii) {
			if (rooms[roomIndex].players[ii].playerID === data.playerID) {
				if (rooms[roomIndex].buzzer.playerID === data.playerID) { //EDGE CASE: removing the player who just buzzed.
					console.log("The player to be removed controls the buzzer. Clearing the buzzer now...");
					rooms[roomIndex].buzzer = {
						canBuzz: true,
						name: "",
						playerID: ""
					};
					io.in(data.id).emit("clear", rooms[roomIndex].buzzer);
				}
				rooms[roomIndex].players[ii].disconnected = true;
			}
		}

		io.sockets.sockets[data.playerID].disconnect(true);

		io.in(data.id).emit("disconnect", rooms[searchRooms(data.id)].players);
	});

	socket.on("disconnect", data => {
		if (log) {
			logStatement("Disconnect occurred.");
		}
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

		if (index >= 0) {
			rooms[room].players[index].disconnected = true;
		}

		if (room >= 0) {
			io.in(rooms[room].id).emit("disconnect", rooms[room].players);
		}

		for (let i = 0; i < rooms.length; ++i) {
			if (rooms[i].adminID === socket.id) {
				if (log) logStatement("Destroying room ", rooms[i].id);
				destroyRoom(i);
				if (log) {
					logStatement("Rooms:");
					logStatement(rooms);
				}
			}
		}


	});
});

/** START API ROUTES */

//API request to create a room
app.get("/api/room/:type", (req, res) => {
	if (req.params.type === "teams") {
		let newRoomID = createRoom("teams").id;
		return res.status(200).send({
			id: newRoomID,
			type: req.params.type
		});
	} else if (req.params.type === "custom") {
		let newRoomID = createRoom("custom").id;
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
	} else {
		return res.status(400).send("Invalid room type.");
	}
});

app.get("/api/score/:room", (req, res) => {
	try {
		let index = searchRooms(req.params.room);
		if (index > -1) {
			return res.status(200).send({
				team1Score: rooms[index].score.team1,
				team2Score: rooms[index].score.team2
			});
		} else {
			return res.status(400).send({
				team1Score: "",
				team2Score: ""
			});
		}
	} catch (err) { console.error(err); }
});

app.get("/api/names/:room", (req, res) => {
	try {
		let index = searchRooms(req.params.room);
		if (index > -1) {
			return res.status(200).send({
				team1Name: rooms[index].team1Name,
				team2Name: rooms[index].team2Name,
				canSwitchTeams: rooms[index].canSwitchTeams
			});
		} else {
			return res.status(400).send({
				team1Name: "",
				team2Name: "",
				canSwitchTeams: ""
			});
		}
	} catch (err) { console.error(err); }
});

app.get("/api/roomCount", (req, res) => {
	return res.status(200).send({
		count: rooms.length
	});
});

app.get("/api/roomsCreated", (req, res) => {
	res.status(200).send({
		count: roomsCreated
	});
});

//get the room type
app.get("/api/roomType/:room", (req, res) => {
	try {
		let index = searchRooms(req.params.room);
		if (log) {
			logStatement("Request to join room ", req.params.room);
			logStatement("Index: ", index);
		}
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
	if (log) {
		logStatement("Request to join room ", req.params.room);
	}
	try {
		if (searchRooms(req.params.room) > -1) {
			res.status(200).send("OK");
		} else {
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

/** END API ROUTES */

server.listen(port, () => {
	logStatement("Server restart.");
	logStatement(`Server running on port ${port}.`);
});
