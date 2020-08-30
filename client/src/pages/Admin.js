import React from "react";
import io from "socket.io-client";
import axios from "axios";
import Players from "../components/Players";
import "../App.css";

class Admin extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            canBuzz: true,
            players: [],
            whoBuzzed: ""
        };

        this.socket = io();
        this.handleClear = this.handleClear.bind(this);
    }
    
    componentDidMount(){
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

    handleClear = event => {
        event.preventDefault();
        this.socket.emit("clear");
    }
    
    render() {
        return(
            <div className="App">
                {!this.state.canBuzz && (
                    <React.Fragment>
                        <button className="clear" onClick={e => this.handleClear(e)}>Clear</button>
                        <p>{this.state.whoBuzzed} has buzzed.</p>
                    </React.Fragment>
                )}
                <Players players={this.state.players} />
            </div>
        );
    }
}

export default Admin;
