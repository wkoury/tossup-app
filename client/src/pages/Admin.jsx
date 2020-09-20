import React from "react";
import io from "socket.io-client";
import axios from "axios";
import Players from "../components/Players";
import "../App.css";

let adminSocket = io("/admin");
let socket = io();

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            room: "",
            canBuzz: true,
            players: [],
            whoBuzzed: {
                name: "",
                key: ""
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        //this should initialize a room
        axios.get("/api/room").then(res => {
            this.setState({
                room: res.data.id
            });
        });

        //listen for other users to log on
        socket.on("login", data => {
            this.setState({
                players: data
            });
        });

        //listen for other users to log off
        socket.on("disconnect", data => {
            this.setState({
                players: data
            });
        });

        //listen for other users to buzz
        socket.on("buzz", data => {
            this.setState({
                canBuzz: false,
                whoBuzzed: {
                    name: data.name,
                    key: data.key
                }
            });
        });

        socket.on("clear", data => {
            this.setState({
                canBuzz: true,
                whoBuzzed: {
                    name: data.name,
                    key: data.key
                }
            });
        });
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleClear = () => {
        adminSocket.emit("clear", { room: this.state.room });
    }

    handleReset = () => {
        adminSocket.emit("reset", { room: this.state.room });
    }

    render() {
        return (
            <div className="App">
                <div className="room">
                    <p>Game Room:</p>
                    <h2>{this.state.room}</h2>
                </div>
                {!this.state.canBuzz && (
                    <React.Fragment>
                        <button className="clear" onClick={e => this.handleClear(e)}>Clear Buzzer</button>
                        <p>{this.state.whoBuzzed.name} has buzzed.</p>
                    </React.Fragment>
                )}
                <Players players={this.state.players} whoBuzzed={this.state.whoBuzzed} />
                <div className="footer">
                    <button className="reset" onClick={e => this.handleReset(e)}>Reset Game</button>
                </div>
            </div>
        );
    }
}

export default Admin;
