import React from "react";
import "../App.css";

class RandomTeams extends React.Component {

    render() {
        const { players, whoBuzzed } = this.props;
        let team1Style, team2Style;
        let index = -1;

        if (Array.isArray(players)) {
            if(players.length === 0) return null;

            players.forEach(player => {            
                if(player.playerID===whoBuzzed.playerID){
                    index = players.indexOf(player);
                }
            });


            if(index % 2 === 0){
                team1Style = {
                    color: "yellow"
                };
            }else{
                team1Style = {
                    color: "white"
                };
            }

            if(index % 2 !== 0){
                team2Style = {
                    color: "yellow"
                };
            }else{
                team2Style = {
                    color: "white"
                };
            }

            if(index ===-1){
                team1Style = {
                    color: "white"
                };
                team2Style = {
                    color: "white"
                };
            }

            const team1 = players.filter(player => players.indexOf(player) % 2 === 0);
            const team2 = players.filter(player => players.indexOf(player) % 2 !== 0);
            return (
                <div className="row">
                    <div className="column left" style={team1Style}>
                        <h5>Team 1</h5>
                        {team1.map(player => <p key={player.playerID} style={{ textDecoration: player.disconnected ? "line-through" : "none" }}>{player.name}</p>)}
                    </div>
                    <div className="column right" style={team2Style}>
                        <h5>Team 2</h5>
                        {team2.map(player => <p key={player.playerID} style={{ textDecoration: player.disconnected ? "line-through" : "none" }}>{player.name}</p>)}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default RandomTeams;
