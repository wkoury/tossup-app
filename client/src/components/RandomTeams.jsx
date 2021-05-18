import React from "react";
import Player from "./Player";
import "../App.css";

class RandomTeams extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = event => {
        if(event.target.name === "team1Score"){
            this.props.updateTeam1Score(event.target.value);
        }

        if(event.target.name === "team2Score"){
            this.props.updateTeam2Score(event.target.value);
        }
    }

    render() {
        const { players, whoBuzzed, canControlScore, team1Score, team2Score, removePlayer } = this.props;
        let team1Style, team2Style;
        let index = -1;

        if (Array.isArray(players)) {
            if (players.length === 0) return null;

            players.forEach(player => {
                if (player.playerID === whoBuzzed.playerID) {
                    index = players.indexOf(player);
                }
            });


            if (index % 2 === 0) {
                team1Style = {
                    color: "orange"
                };
            } else {
                team1Style = {
                    color: "white"
                };
            }

            if (index % 2 !== 0) {
                team2Style = {
                    color: "orange"
                };
            } else {
                team2Style = {
                    color: "white"
                };
            }

            if (index === -1) {
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
                        {canControlScore ? <input type="number" className="score-input" name="team1Score" value={team1Score} onChange={e => this.handleChange(e)}></input> : <h6>{team1Score}</h6>}
                        <h5>Team 1</h5>
                        {team1.map(player => <Player key={player.playerID} playerID={player.playerID} disconnected={player.disconnected} name={player.name} removePlayer={removePlayer} />)}
                    </div>
                    <div className="column right" style={team2Style}>
                        {canControlScore ? <input type="number" className="score-input" name="team2Score" value={team2Score} onChange={e => this.handleChange(e)}></input> : <h6>{team2Score}</h6>}
                        <h5>Team 2</h5>
                        {team2.map(player => <Player key={player.playerID} playerID={player.playerID} disconnected={player.disconnected} name={player.name} removePlayer={removePlayer} />)}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default RandomTeams;
