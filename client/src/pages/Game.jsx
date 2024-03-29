import React from "react";
import io from "socket.io-client";
import axios from "axios";
import Navbar from "../components/Navbar";
import RandomTeams from "../components/RandomTeams";
import CustomTeams from "../components/CustomTeams";
import Room from "../components/Room";
import Disconnected from "../components/Disconnected";
import { withRouter } from "react-router-dom";
import "../App.css";

class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			socket: io(),
			room: props.room,
			type: "",
			name: props.name,
			players: [],
			canBuzz: true,
			whoBuzzed: {
				name: "",
				playerID: ""
			},
			disconnected: false,
			team1Score: "",
			team2Score: "",
			team1Name: "",
			team2Name: "",
			canSwitchTeams: true
		};

		this.interval = setInterval(() => { //every half second, check to see if the socket is still connected
			if (!this.state.socket.connected) {
				this.setState({
					disconnected: true
				});
			}
		}, 500);

		this.handleBuzz = this.handleBuzz.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.initializePlayer = this.initializePlayer.bind(this);
		this.switchTeams = this.switchTeams.bind(this);
	}

	authenticate = () => {
		axios.get(`/api/rooms/${this.state.room}`).then(res => {
			if (res.data === "DNE") {
				this.props.history.push("/");
			}
		}).catch(e => this.props.history.push("/"));
	}

	switchTeams = () => {
		this.state.socket.emit("switch", {
			id: this.state.room,
			playerID: this.state.socket.id
		});
	}

	componentDidMount() {
		if (this.props.room === "" || this.props.name === "") {
			this.props.history.push("/");
			return null;
		}

		this.authenticate();

		axios.get(`/api/players/${this.state.room}`).then(res => {
			this.setState({
				players: res.data
			});
		}).catch(e => this.props.history.push("/"));

		axios.get(`/api/buzzer/${this.state.room}`).then(res => {
			this.setState({
				canBuzz: res.data.canBuzz,
				whoBuzzed: {
					name: res.data.name,
					playerID: res.data.key
				}
			});
		}).catch(e => this.props.history.push("/"));

		axios.get(`/api/roomType/${this.state.room}`).then(res => {
			this.setState({
				type: res.data.type
			});
			if (res.data.type === "teams" || res.data.type === "custom") {
				axios.get(`/api/score/${this.state.room}`).then(res => {
					this.setState({
						team1Score: res.data.team1Score,
						team2Score: res.data.team2Score
					});
				});
			}

			if (res.data.type === "custom") {
				axios.get(`/api/names/${this.state.room}`).then(res => {
					this.setState({
						team1Name: res.data.team1Name,
						team2Name: res.data.team2Name,
						canSwitchTeams: res.data.canSwitchTeams
					});
				});
			}
		});

		//listen for other users to log on
		this.state.socket.on("login", data => {
			this.setState({
				players: data
			});
		});

		//listen for other users to log off
		this.state.socket.on("disconnect", data => {
			this.setState({
				players: data
			});
		});

		//listen for other users to buzz
		this.state.socket.on("buzz", data => {
			//create a team name string to add to name
			let teamName;
			this.state.players.forEach(player => {
				if(player.playerID === data.playerID) {
					// check which team the player is on
					teamName = player.team1 ? (typeof(this.state.team1Name) !== "undefined" ? " (" + this.state.team1Name + ")" : "") : (typeof(this.state.team2Name) !== "undefined" ? " (" + this.state.team2Name + ")" : "");
				}
			});
			// don't use the custom team name if the game does not have custom teams
			if(this.state.type !== "custom") {
				teamName = "";
			}
			this.setState({
				canBuzz: false,
				whoBuzzed: {
					name: data.name + teamName,
					playerID: data.playerID
				}
			});
		});

		//listen for buzzer to be cleared
		this.state.socket.on("clear", data => {
			this.setState({
				canBuzz: true,
				whoBuzzed: {
					name: data.name,
					playerID: data.playerID
				}
			});
		});

		this.state.socket.on("score", data => {
			this.setState({
				team1Score: data.team1,
				team2Score: data.team2
			});
		});

		this.state.socket.on("name", data => {
			this.setState({
				team1Name: data.team1,
				team2Name: data.team2
			});
		});

		this.state.socket.on("switch", data => {
			this.setState({
				players: data
			});
		});

		this.state.socket.on("lock", data => {
			this.setState({
				canSwitchTeams: data
			});
		});

		//on player disconnect
		this.state.socket.on("disconnect", data => {
			this.setState({
				players: data
			});
		});

		this.state.socket.on("kill", () => {
			this.setState({
				disconnected: true
			});
		});

		this.state.socket.on("remove", data => {
			this.setState({
				players: data.players
			});
		});

		this.initializePlayer();

		document.addEventListener("keydown", e => {
			if (e.code === "Space") {
				this.handleBuzz(e);
			}
		});
	}

	initializePlayer = () => {
		this.state.socket.emit("login", {
			name: this.state.name,
			id: this.state.room,
			playerID: this.state.socket.id,
			disconnected: false
		});
	}

	componentWillUnmount() {
		clearInterval(this.interval);
		this.state.socket.disconnect();
	}

	handleBuzz = event => {
		this.state.socket.emit("buzz",
			{
				name: this.state.name,
				id: this.state.room
			});
	}

	render() {
		if (this.state.disconnected) {
			return (
				<Disconnected />
			);
		}
		return (
			<React.Fragment>
				<Navbar needsLessMargin={true} />
				<div className="App">
					<div>
						<Room room={this.state.room} />
					</div>
					{this.state.canBuzz ? (<div>
						<button className="buzzer" onClick={e => this.handleBuzz(e)}>Buzz</button>
					</div>) : (
						<h4>{this.state.whoBuzzed.name} has buzzed.</h4>
					)}
					{/* {this.state.type === "default" && (<Players players={this.state.players}/>)} */}
					{this.state.type === "teams" && (
						<RandomTeams
							players={this.state.players}
							whoBuzzed={this.state.whoBuzzed}
							team1Score={this.state.team1Score}
							team2Score={this.state.team2Score}
							canControlScore={false}
							removePlayer={() => { }} //do nothing
							isAdmin={false}
						/>
					)}
					{this.state.type === "custom" && (
						<CustomTeams
							players={this.state.players}
							whoBuzzed={this.state.whoBuzzed}
							team1Score={this.state.team1Score}
							team2Score={this.state.team2Score}
							team1Name={this.state.team1Name}
							team2Name={this.state.team2Name}
							canControlScore={false}
							switchTeams={this.switchTeams}
							canSwitchTeams={this.state.canSwitchTeams}
							removePlayer={() => { }} //do nothing
							isAdmin={false}
						/>
					)}
				</div>
			</React.Fragment >
		);
	}
}

export default withRouter(Game);
