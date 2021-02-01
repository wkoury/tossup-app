import React from "react";
import "../App.css";

class CustomTeams extends React.Component {
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

        if(event.target.name === "team1Name"){
            this.props.updateTeam1Name(event.target.value);
        }

        if(event.target.name === "team2Name"){
            this.props.updateTeam2Name(event.target.value);
        }
    }

    render() {
        const { players, /* whoBuzzed, */ canControlScore, team1Score, team2Score, team1Name, team2Name, switchTeams } = this.props;
        let team1Style, team2Style;
        // let index = -1;

        if (Array.isArray(players)) {
            if (players.length === 0) return null;

            // players.forEach(player => {
            //     if (player.playerID === whoBuzzed.playerID) {
            //         index = players.indexOf(player);
            //     }
            // });


            // if (index % 2 === 0) {
            //     team1Style = {
            //         color: "orange"
            //     };
            // } else {
            //     team1Style = {
            //         color: "white"
            //     };
            // // }

            // if (index % 2 !== 0) {
            //     team2Style = {
            //         color: "orange"
            //     };
            // } else {
            //     team2Style = {
            //         color: "white"
            //     };
            // // }

            if (true) { //FIXME
                team1Style = {
                    color: "white"
                };
                team2Style = {
                    color: "white"
                };
            }

            const team1 = players.filter(player => player.team1);
            const team2 = players.filter(player => !player.team1);
            return (
                <React.Fragment>
					<div className="row">
						<div className="column left" style={team1Style}>
							{canControlScore ? <input type="number" className="score-input" name="team1Score" value={team1Score} onChange={e => this.handleChange(e)}></input> : <h6>{team1Score}</h6>}
							{canControlScore ? <input type="text" className="name-input" name="team1Name" value={team1Name} onChange={e => this.handleChange(e)}></input> : <h5>{team1Name}</h5>}
							{team1.map(player => <p key={player.playerID} style={{ textDecoration: player.disconnected ? "line-through" : "none" }}>{player.name}</p>)}
						</div>
						<div className="column right" style={team2Style}>
							{canControlScore ? <input type="number" className="score-input" name="team2Score" value={team2Score} onChange={e => this.handleChange(e)}></input> : <h6>{team2Score}</h6>}
							{canControlScore ? <input type="text" className="name-input" name="team2Name" value={team2Name} onChange={e => this.handleChange(e)}></input> : <h5>{team2Name}</h5>}
							{team2.map(player => <p key={player.playerID} style={{ textDecoration: player.disconnected ? "line-through" : "none" }}>{player.name}</p>)}
						</div>
					</div>
					<div>
						{!canControlScore && (
							<button className="switch-teams" onClick={() => switchTeams()}>Switch Teams</button>
						)}
					</div>
				</React.Fragment>
            );
        } else {
            return null;
        }
    }
}

export default CustomTeams;
