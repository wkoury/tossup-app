import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Landing from "./pages/Landing";
import Game from "./pages/Game";
import CreateGame from "./pages/CreateGame";
import JoinGame from "./pages/JoinGame";
import Moderator from "./pages/Moderator";
import About from "./pages/About";
import "./App.css";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			room: "", //we may not end up needing this
			name: ""
		}

		this.setRoom = this.setRoom.bind(this);
		this.setName = this.setName.bind(this);
	}

	setRoom = room => {
		this.setState({ room: room });
	}

	setName = name => {
		this.setState({ name: name });
	}

	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route path="/join" component={() => <JoinGame setName={this.setName} setRoom={this.setRoom} />} />
					<Route path="/game" component={() => <Game name={this.state.name} room={this.state.room} />} />
					<Route exact path="/moderator/:type" component={Moderator} />
					<Route path="/create" component={CreateGame} />
					<Route path="/about" component={About} />
					<Redirect to="/" />
				</Switch>
			</Router>
		);
	}
}

export default App;
