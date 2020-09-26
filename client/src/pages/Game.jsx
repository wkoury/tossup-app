import React from "react";
import io from "socket.io-client";
import axios from "axios";
// import Teams from "../components/Teams";
// import Players from "../components/Players";
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
            }
        };

        this.handleBuzz = this.handleBuzz.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.initializePlayer = this.initializePlayer.bind(this);
    }

    authenticate = () => {
        axios.get(`/api/rooms/${this.state.room}`).then(res => {
            if (res.data === "DNE") {
                this.props.history.push("/");
            }
        }).catch(e => this.props.history.push("/"));
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
            this.setState({
                canBuzz: false,
                whoBuzzed: {
                    name: data.name,
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

        //on player disconnect
        this.state.socket.on("disconnect", data => {
            this.setState({
                players: data
            });
        });

        this.initializePlayer();
    }

    initializePlayer = () => {
        this.state.socket.emit("login", {
            name: this.state.name,
            id: this.state.room,
            playerID: this.state.socket.id,
            disconnected: false
        });
    }

    handleBuzz = event => {
        this.state.socket.emit("buzz",
            {
                name: this.state.name,
                id: this.state.room
            });
    }

    render() {
        return (
            <div className="App">
                <div>
                    <div className="room">
                        <p>Game Room:</p>
                        <h2>{this.state.room}</h2>
                    </div>
                    {this.state.canBuzz ? (<div>
                        <button className="buzzer" onClick={e => this.handleBuzz(e)}>Buzz</button>
                    </div>) : (
                            <h4>{this.state.whoBuzzed.name} has buzzed.</h4>
                        )}
                    {/* {this.state.type === "default" && (<Players players={this.state.players}/>)} */}
                    {/* {this.state.type === "teams" && (<Teams players={this.state.players} whoBuzzed={this.state.whoBuzzed} />)} */}
                </div>
            </div>
        );
    }
}

export default withRouter(Game);
