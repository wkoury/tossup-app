import React from "react";
import "../App.css";

const Player = props => {
	return(
		<p
			className={props.disconnected ? "player-disabled" : (props.isAdmin ? "admin-player" : "")}
			style={{ opacity: props.disconnected ? 0.5 : 1.0 }}
			onClick={() => props.removePlayer(props.playerID)}
		>
			{props.name}
		</p>
	);
}

export default Player;