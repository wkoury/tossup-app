import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Game from "./pages/Game";
import Admin from "./pages/Admin";
import Landing from "./pages/Landing";
import CreateGame from "./pages/CreateGame";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/game" component={Game} />
          <Route path="/admin" component={Admin} />
          <Route path="/create" component={CreateGame} />
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

export default App;
