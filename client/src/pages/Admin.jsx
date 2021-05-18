import React from "react";
import io from "socket.io-client";
import axios from "axios";
import Players from "../components/Players";
import RandomTeams from "../components/RandomTeams";
import CustomTeams from "../components/CustomTeams";
import Navbar from "../components/Navbar";
import Room from "../components/Room";
import { withRouter } from "react-router-dom";
import buzzerSound from "../assets/ding.mp3";
import "../App.css";

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            room: "",
            type: "",
            canBuzz: true,
            players: [],
            whoBuzzed: {
                name: "",
                playerID: ""
            },
            team1Score: 0,
            team2Score: 0,
            team1Name: "Team 1",
            team2Name: "Team 2",
            canSwitchTeams: true
        };

        this.socket = io();

        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.updateTeam1Score = this.updateTeam1Score.bind(this);
        this.updateTeam2Score = this.updateTeam2Score.bind(this);
    }

    authenticate = () => {
        axios.get(`/api/rooms/${this.state.room}`).then(res => {
            if(res.data === "DNE"){
                this.props.history.push("/");
            }
        }).catch(e => this.props.history.push("/"));
    }

    updateTeam1Score = score => {
        this.setState({
            team1Score: score
        });

        this.socket.emit("score", { id: this.state.room, team1: score, team2: this.state.team2Score });
    }

    updateTeam2Score = score => {
        this.setState({
            team2Score: score
        });

        this.socket.emit("score", { id: this.state.room, team1: this.state.team1Score, team2: score });
    }

    updateTeam1Name = name => {
        this.setState({
            team1Name: name
        });

        this.socket.emit("name", { id: this.state.room, team1: name, team2: this.state.team2Name });
    }


    updateTeam2Name = name => {
        this.setState({
            team2Name: name
        });

        this.socket.emit("name", { id: this.state.room, team1: this.state.team1Name, team2: name });
    }

    toggleLock = () => {
        this.setState({
            canSwitchTeams: !this.state.canSwitchTeams
        });

        this.socket.emit("lock", { id: this.state.room, canSwitchTeams: this.state.canSwitchTeams})
    }

    removePlayer = playerID => {
        this.socket.emit("remove", { id: this.state.room, playerID: playerID });
    }

    componentDidMount() {

        //this should initialize a room
        const APIlink = `/api/room/${this.props.match.params.type}`
        axios.get(APIlink).then(res => {
            this.setState({
                room: res.data.id,
                type: res.data.type
            });

            this.socket.emit("create", { id: res.data.id })
        }).catch(e => this.props.history.push("/"));


        //listen for other users to log on
        this.socket.on("login", data => {
            this.setState({
                players: data
            });
        });

        //listen for other users to log off
        this.socket.on("disconnect", data => {
            this.setState({
                players: data
            });
        });

        //listen for other users to buzz
        this.socket.on("buzz", data => {
            this.setState({
                canBuzz: false,
                whoBuzzed: {
                    name: data.name,
                    playerID: data.playerID
                }
            });
            let sound = new Audio(buzzerSound);
            sound.play();
        });

        //listen for players to switch teams when custom teams are selected
        this.socket.on("switch", data => {
            this.setState({
                players: data
            });
        });

        this.socket.on("clear", data => {
            this.setState({
                canBuzz: true,
                whoBuzzed: {
                    name: data.name,
                    playerID: data.playerID
                }
            });
        });

        document.addEventListener("keydown", e => {
            if(e.code === "Space"){
                this.handleClear();
            }
        });
    }

    componentWillUnmount(){
        this.socket.disconnect();
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleClear = () => {
        this.socket.emit("clear", { id: this.state.room });
    }

    handleReset = () => {
        this.socket.emit("reset", { id: this.state.room });
    }

    render() {
        return (
            <React.Fragment>
                <Navbar needsLessMargin={true}/>
                <div className="App">
                    <Room room={this.state.room}/>
                    {!this.state.canBuzz && (
                        <React.Fragment>
                            <button className="clear" onClick={e => this.handleClear(e)}>Clear</button>
                            <p>{this.state.whoBuzzed.name} has buzzed.</p>
                        </React.Fragment>
                    )}
                    {this.state.type === "default" && (
                        <Players
                            players={this.state.players}
                            whoBuzzed={this.state.whoBuzzed}
                            removePlayer={this.removePlayer}
                        />
                    )}
                    {this.state.type === "teams" && (
                        <RandomTeams
                            players={this.state.players}
                            whoBuzzed={this.state.whoBuzzed}
                            team1Score={this.state.team1Score}
                            team2Score={this.state.team2Score}
                            canControlScore={true}
                            updateTeam1Score={this.updateTeam1Score}
                            updateTeam2Score={this.updateTeam2Score}
                            removePlayer={this.removePlayer}
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
                            canControlScore={true}
                            updateTeam1Score={this.updateTeam1Score}
                            updateTeam2Score={this.updateTeam2Score}
                            updateTeam1Name={this.updateTeam1Name}
                            updateTeam2Name={this.updateTeam2Name}
                            canSwitchTeams={this.state.canSwitchTeams}
                            removePlayer={this.removePlayer}
                        />
                    )}
                    {this.state.type==="custom" && (<div>
                    {this.state.canSwitchTeams ? <button className="toggle" onClick={() => this.toggleLock()}><span role="img" aria-label="locked">🔓</span></button> : <button className="toggle" onClick={() => this.toggleLock()}><span role="img" aria-label="unlocked">🔒</span></button> }
                        <p>Team switching {this.state.canSwitchTeams ? "unlocked" : "locked"}.</p>
                    </div>)}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(Admin);
