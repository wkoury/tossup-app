import React from "react";
import axios from "axios";
import io from "socket.io-client";
import Players from "../components/Players";
import "../App.css";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            login: false,
            players: [],
            myKey: Date.now(),
            canBuzz: true,
            whoBuzzed: ""
        };

        this.socket = io();

        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBuzz = this.handleBuzz.bind(this);
    }



    componentDidMount() {
        axios.get("/api/players").then(res => {
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
                whoBuzzed: res.data.name.name
            });
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

        // //listen for other users to log off
        // this.socket.on("disconnect", data => {
        //     console.log(data);
        //     this.setState({
        //         players: data
        //     });
        // });

        //listen for other users to buzz
        this.socket.on("buzz", data => {
            this.setState({
                canBuzz: false,
                whoBuzzed: data.name.name
            });
        });

        //listen for buzzer to be cleared
        this.socket.on("clear", () => {
            this.setState({
                canBuzz: true
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

        if(this.state.name.length >= 15){
            alert("The name you entered is too long!");
            return;
        }

        if (this.state.name !== "") {
            this.setState({
                login: true
            });
            this.socket.emit("login",
                {
                    name: this.state.name,
                    key: this.state.myKey
                },
                () => {/* callback function */ });
        }

        localStorage.setItem("player", JSON.stringify({
            name: this.state.name,
            key: this.state.myKey
        }));
    }

    handleBuzz = event => {
        event.preventDefault();
        this.socket.emit("buzz",
            {
                name: this.state.name,
                key: this.state.myKey
            },
            () => {/* callback function */ });
    }

    render() {
        return (
            <div className="App">
                {this.state.login === false ? (
                    <div className="initialization">
                        <h4>Enter your name:</h4>
                        <div className="form-fields">
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
                                    <h4>{this.state.whoBuzzed} has buzzed.</h4>
                                )}
                            <Players players={this.state.players} />
                        </div>
                    )}
            </div>
        );
    }
}

export default Game;
