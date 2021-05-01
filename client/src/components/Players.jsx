import React from "react";
import Player from "./Player";
import "../App.css";

class Players extends React.Component {

    render() {
        const { players } = this.props;

        if (Array.isArray(players)) {
            if(players.length === 0) return null;

            return (
                <div className="row">
                    <h5>Players</h5>
                    {players.map(player => <Player key={player.playerID} name={player.name} disconnected={player.disconnected} />)}
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Players;
