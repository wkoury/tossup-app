import React from "react";
import "../App.css";

class Players extends React.Component {

    render() {
        const { players, whoBuzzed } = this.props;
        let team1Style, team2Style;
        let index = -1;

        players.forEach(player => {            
            if(player.key===whoBuzzed.key){
                index = players.indexOf(player);
            }
        });

        console.log(index);

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

        if (Array.isArray(players)) {
            const team1 = players.filter(player => players.indexOf(player) % 2 === 0);
            const team2 = players.filter(player => players.indexOf(player) % 2 !== 0);
            return (
                <div className="row">
                    <div className="column left" style={team1Style}>
                        <h5>Team 1</h5>
                        {team1.map(player => <p key={player.key}>{player.name}</p>)}
                    </div>
                    <div className="column right" style={team2Style}>
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
