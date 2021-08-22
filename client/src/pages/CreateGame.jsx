import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const CreateGame = () => {
	return (
		<React.Fragment>
			<Navbar />
			<div className="App">
				<Link to="/moderator/default">No Teams</Link>
				<br></br>
				<Link to="/moderator/teams">Random Teams</Link>
				<br></br>
				<Link to="/moderator/custom">Custom Teams</Link>
			</div>
		</React.Fragment>
	);
}

export default CreateGame;
