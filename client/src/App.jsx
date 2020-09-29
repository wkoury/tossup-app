import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Game from "./pages/Game";
import Admin from "./pages/Admin";
import Landing from "./pages/Landing";
import CreateGame from "./pages/CreateGame";
import JoinGame from "./pages/JoinGame";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import "./App.css";

class App extends React.Component {
  constructor(props){
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
          <Route exact path="/game" component={() => <Game name={this.state.name} room={this.state.room} />} />
          <Route path="/admin/:type" component={Admin} />
          <Route path="/create" component={CreateGame} />
          <Route path="/about" component={About} />
          <Route path="/dash" component={Dashboard} />
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

export default App;
