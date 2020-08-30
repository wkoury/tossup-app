import React from "react";
import "../App.css";

class Players extends React.Component {

    render() {
        const { players } = this.props;

        if (Array.isArray(players)) {
            const team1 = players.filter(player => players.indexOf(player) % 2 === 0);
            const team2 = players.filter(player => players.indexOf(player) % 2 !== 0);
            return (
                <div className="row">
                    <div className="column left">
                        <h5>Team 1</h5>
                        {team1.map(player => <p key={player.key}>{player.name}</p>)}
                    </div>
                    <div className="column right">
                        <h5>Team 2</h5>
                        {team2.map(player => <p key={player.key}>{player.name}</p>)}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Players;
