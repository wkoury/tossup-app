import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Loadable from "react-loadable";
import "./App.css";

//Lazy-loaded components
const Landing = Loadable({
	loader: () => import("./pages/Landing"),
	loading: React.Fragment
});

const Game = Loadable({
	loader: () => import("./pages/Game"),
	loading: React.Fragment
});

const Admin = Loadable({
	loader: () => import("./pages/Admin"),
	loading: React.Fragment
});

const About = Loadable({
	loader: () => import("./pages/About"),
	loading: React.Fragment
});

const JoinGame = Loadable({
	loader: () => import("./pages/JoinGame"),
	loading: React.Fragment
});

const CreateGame = Loadable({
	loader: () => import("./pages/CreateGame"),
	loading: React.Fragment
});

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
					<Route exact path="/admin/:type" component={Admin} />
					<Route path="/create" component={CreateGame} />
					<Route path="/about" component={About} />
					<Redirect to="/" />
				</Switch>
			</Router>
		);
	}
}

export default App;
