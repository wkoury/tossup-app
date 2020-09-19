import React from "react";
import axios from "axios";
import io from "socket.io-client";
import Players from "../components/Players";
import "../App.css";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: "",
            name: "",
            login: false,
            players: [],
            canBuzz: true,
            whoBuzzed: {
                name: "",
                key: ""
            }
        };

        this.socket = io();

        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBuzz = this.handleBuzz.bind(this);
    }

    componentDidMount() {
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

    handleChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleLogin = (event) => {
        event.preventDefault();

        if (this.state.name.length >= 15) {
            alert("The name you entered is too long!");
            return;
        }

        if (this.state.name !== "" && this.state.room !== "") {
            this.setState({
                login: true
            });
            this.socket.join(this.state.room);
            this.socket.emit("login",
                {
                    name: this.state.name,
                    key: this.socket.id,
                    disconnected: false
                },
                () => {/* callback function */ });
        }

        localStorage.setItem("player", JSON.stringify({
            name: this.state.name,
            key: this.socket.id
        }));

        axios.get("/api/players", { params: { room: this.state.room } }).then(res => {
            this.setState({
                players: res.data
            });

            res.data.forEach(player => {
                if (player.key === JSON.parse(localStorage.getItem("player")).key) {
                    this.setState({
                        login: true,
                        name: JSON.parse(localStorage.getItem("player")).name,
                        myKey: JSON.parse(localStorage.getItem("player")).key
                    });
                }
            })
        });

        axios.get("/api/buzzer").then(res => {
            this.setState({
                canBuzz: res.data.canBuzz,
                whoBuzzed: {
                    name: res.data.name,
                    key: res.data.key
                }
            });
        });
    }

    handleBuzz = event => {
        event.preventDefault();
        this.socket.emit("buzz",
            {
                name: this.state.name,
                key: this.socket.id
            },
            () => {/* callback function */ });
    }

    render() {

        return (
            <div className="App">
                {this.state.login === false ? (
                    <div className="initialization">
                        <h4>Enter your room & name:</h4>
                        <div className="form-fields">
                            <input
                                className="room-input"
                                type="text"
                                placeholder="Room ID"
                                name="room"
                                value={this.state.room}
                                onChange={e => this.handleChange(e)}
                            ></input>
                            <br></br>
                            <input
                                className="name-input"
                                type="text"
                                placeholder="Name"
                                name="name"
                                value={this.state.name}
                                onChange={e => this.handleChange(e)}
                            ></input>
                            <button
                                className="name-submit"
                                onClick={(e) => this.handleLogin(e)}
                            >
                                Join
                    </button>
                        </div>
                    </div>
                ) : (
                        <div>
                            {this.state.canBuzz ? (<div>
                                <button className="buzzer" onClick={e => this.handleBuzz(e)}>Buzz</button>
                            </div>) : (
                                    <h4>{this.state.whoBuzzed.name} has buzzed.</h4>
                                )}
                            <Players players={this.state.players} whoBuzzed={this.state.whoBuzzed} />
                        </div>
                    )}
            </div>
        );
    }
}

export default Game;
