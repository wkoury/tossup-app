import React from "react";
import io from "socket.io-client";
import axios from "axios";
import Players from "../components/Players";
import "../App.css";

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

        this.socket = io();

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

            this.socket.emit("create", { id: res.data.id })
        });


        //listen for other users to log on
        this.socket.on("login", data => {
            console.log(data);
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
                    key: data.key
                }
            });
        });

        this.socket.on("clear", data => {
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
        this.socket.emit("clear", { id: this.state.room });
    }

    handleReset = () => {
        this.socket.emit("reset", { id: this.state.room });
    }

    render() {
        console.log(this.state.players);
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
                {/* <div className="footer">
                    <button className="reset" onClick={e => this.handleReset(e)}>Reset Game</button>
                </div> */}
            </div>
        );
    }
}

export default Admin;
