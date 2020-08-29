import React from "react";
import io from "socket.io-client";
import "../App.css";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            login: false,
            players: [],
            myKey: Date.now()
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
        });

        //listen for other users to log off
        this.socket.on("disconnect", data => {
            this.setState({
            players: data
            });
        });

        //listen for other users to buzz
        this.socket.on("buzz", () => {
            this.setState({ canBuzz: false });
        });

        //listen for buzzer to be cleared
        this.socket.on("clear", () => {
            this.setState({ canBuzz: true });
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
    };

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
                    <div>
                    <button className="buzzer" onClick={e => this.handleBuzz(e)}>Buzz</button>
                    </div>
                    <h4>Connected players:</h4>
                    {this.state.players.map(player => <p key={player.key}>{player.name}</p>)}
                </div>
                )}
            </div>
        );
    }
}

export default Game;
