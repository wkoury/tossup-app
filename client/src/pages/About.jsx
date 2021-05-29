import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
	return (
		<React.Fragment>
			<Navbar />
			<div className="App">
				<div className="about">
					<p>Tossup is an easy online buzzer system for both virtual and in-person events. </p>
					<p>Easier to set up and far cheaper than a traditional lockout buzzer, it was created by <a href="https://wkoury.com" rel="noopener noreferrer" target="_blank">Will Koury</a> when he found how unintuitive and clunky other online systems felt.</p>
					<p>Using Tossup is simple: create a game and share your game code with your players. Your players will then enter the game code and their name in order to join. When a player buzzes, the system locks and prevents all other players from buzzing. Clearing the buzzer opens it back up for everyone. The game will automatically end when its creator leaves the page.</p>
					<p>Tossup and all of its features are free to use and will remain so for the foreseeable future.</p>
					<p>Feedback? <a href="mailto:wkoury@hey.com">Email</a> me!</p>
				</div>
			</div>
		</React.Fragment>
	);
}

export default About;
