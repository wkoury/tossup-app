import React from "react";
import io from "socket.io-client";
import axios from "axios";
import Players from "../components/Players";
import Teams from "../components/Teams";
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
            }
        };

        this.socket = io();

        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    authenticate = () => {
        axios.get(`/api/rooms/${this.state.room}`).then(res => {
            if(res.data === "DNE"){
                this.props.history.push("/");
            }
        }).catch(e => this.props.history.push("/"));
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

        this.socket.on("clear", data => {
            this.setState({
                canBuzz: true,
                whoBuzzed: {
                    name: data.name,
                    playerID: data.playerID
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
        return (
            <div className="App" style={{ background: this.state.canBuzz ? "#333" : "red" }}>
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
                {this.state.type === "default" && (<Players players={this.state.players} whoBuzzed={this.state.whoBuzzed} />)}
                {this.state.type === "teams" && (<Teams players={this.state.players} whoBuzzed={this.state.whoBuzzed} />)}
                {/* <div className="footer">
                    <button className="reset" onClick={e => this.handleReset(e)}>Reset Game</button>
                </div> */}
            </div>
        );
    }
}

export default withRouter(Admin);
