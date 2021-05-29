import React from "react";
import Player from "./Player";
import "../App.css";

class Players extends React.Component {

	render() {
		const { players, removePlayer, isAdmin } = this.props;

		if (Array.isArray(players)) {
			if (players.length === 0) return null;

			return (
				<div className="row">
					<h5>Players</h5>
					{players.map(player => <Player key={player.playerID} playerID={player.playerID} name={player.name} disconnected={player.disconnected} removePlayer={removePlayer} isAdmin={isAdmin} />)}
				</div>
			);
		} else {
			return null;
		}
	}
}

export default Players;
