import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";

const Disconnected = () => {
	return (
		<React.Fragment>
			<Navbar />
			<div className="App">
				<h3>You were disconnected!</h3>
				<h6>Return to the <Link to="/join">Join Page</Link>.</h6>
			</div>
		</React.Fragment>
	);
}

export default Disconnected;
