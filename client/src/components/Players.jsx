import React from "react";
import "../App.css";

class Players extends React.Component {

    render() {
        const { players } = this.props;

        if (Array.isArray(players)) {
            if(players.length === 0) return null;

            return (
                <div className="row">
                    <h5>Players</h5>
                    {players.map(player => <p key={player.playerID} style={{ textDecoration: player.disconnected ? "line-through" : "none" }}>{player.name}</p>)}
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Players;
