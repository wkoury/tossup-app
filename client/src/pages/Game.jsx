import React from "react";
import io from "socket.io-client";
import axios from "axios";
import Players from "../components/Players";
import "../App.css";

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            room: props.room,
            name: props.name,
            players: [],
            canBuzz: true,
            whoBuzzed: {
                name: "",
                key: ""
            }
        };

        this.socket = io();

        this.handleBuzz = this.handleBuzz.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/players/${this.state.room}`).then(res => {
            this.setState({
                players: res.data
            });
        });

        axios.get(`/api/buzzer/${this.state.room}`).then(res => {
            this.setState({
                canBuzz: res.data.canBuzz,
                whoBuzzed: {
                    name: res.data.name,
                    key: res.data.key
                }
            });
        });

        this.socket.emit("login", {
            name: this.state.name,
            key: this.socket.id,
            room: this.state.room,
            disconnected: false
        });

        //listen for other users to log on
        this.socket.on("login", data => {
            this.setState({
                players: data
            });
            if (data.length === 0) {
                this.setState({ login: false });
            }
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
                    key: this.socket.id
                }
            });
        });

        //listen for buzzer to be cleared
        this.socket.on("clear", data => {
            this.setState({
                canBuzz: true,
                whoBuzzed: {
                    name: data.name,
                    key: data.key
                }
            });
        });

        //on player disconnect
        this.socket.on("disconnect", data => {
            this.setState({
                players: data
            });
        });
    }

    handleBuzz = event => {
        event.preventDefault();
        this.socket.emit("buzz",
            {
                name: this.state.name,
                key: this.socket.id,
                room: this.state.room
            },
            () => {/* callback function */ });
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
                    <Players players={this.state.players} whoBuzzed={this.state.whoBuzzed} />
                </div>
            </div>
        );
    }
}

export default Game;
