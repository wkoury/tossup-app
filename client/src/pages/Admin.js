import React from "react";
import io from "socket.io-client";
import axios from "axios";
import Players from "../components/Players";
import "../App.css";

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: false,
            password: "",
            canBuzz: true,
            players: [],
            whoBuzzed: ""
        };

        this.socket = io();
        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        //initial data loads
        axios.get("/api/players").then(res => {
            this.setState({
                players: res.data
            });
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
        });

        //listen for other users to log off
        this.socket.on("disconnect", data => {
            this.setState({
                players: data
            });
        });

        //listen for other users to buzz
        this.socket.on("buzz", data => {
            this.setState({ canBuzz: false, whoBuzzed: data.name.name });
        });

        this.socket.on("clear", () => {
            this.setState({ canBuzz: true });
        })
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleLogin = () => {
        axios.post("/api/admin", { password: this.state.password })
        .then(res => {
            console.log(res.data);
            if(res.data==="yes"){
                this.setState({ login: true });
            }
        })
        .catch(err => console.error(err));
    }

    handleClear = () => {
        this.socket.emit("clear");
    }

    handleReset = () => {
        this.socket.emit("reset");
    }

    render() {
        if(this.state.login){
            return (
                <div className="App">
                    {!this.state.canBuzz && (
                        <React.Fragment>
                            <button className="clear" onClick={e => this.handleClear(e)}>Clear Buzzer</button>
                            <p>{this.state.whoBuzzed} has buzzed.</p>
                        </React.Fragment>
                    )}
                    <Players players={this.state.players} />
                    <div className="footer">
                        <button className="reset" onClick={e => this.handleReset(e)}>Reset Game</button>
                    </div>
                </div>
            );
        }else{
            return (
                <div className="App">
                    <div className="initialization">
                        <h4>Enter password:</h4>
                        <div className="form-fields">
                            <input
                                className="name-input"
                                type="password"
                                placeholder="password"
                                name="password"
                                value={this.state.password}
                                onChange={e => this.handleChange(e)}
                            ></input>
                            <button
                                className="name-submit"
                                onClick={(e) => this.handleLogin(e)}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Admin;
