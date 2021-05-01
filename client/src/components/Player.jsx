import React from "react";
import "../App.css";

const Player = props => {
	return(
		<p key={props.playerID} className={props.disconnected ? "player-disabled" : "player"} style={{ opacity: props.disconnected ? 0.5 : 1.0 }}>{props.name}</p>
	);
}

export default Player;