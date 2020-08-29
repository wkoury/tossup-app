import React from "react";
import io from "socket.io-client";
import "../App.css";

class Admin extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            canBuzz: true,
            players: [],
            buzzedPlayer: ""
        };

        this.socket = io();
    }
    
    componentDidMount(){
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
    }
    
    render() {
        return(
            <div className="App">
                {!this.state.canBuzz && (
                    <React.Fragment>
                        <button className="clear">Clear</button>
                        <p>{this.state.buzzedPlayer} has buzzed.</p>
                    </React.Fragment>
                )}
                <h4>Connected players:</h4>
                {this.state.players.map(player => <p key={player.key}>{player.name}</p>)}
            </div>
        );
    }
}

export default Admin;
