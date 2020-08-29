import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Game from "./components/Game";
import Admin from "./components/Admin";
import "./App.css";

class App extends React.Component {
  render(){
    return(
      <Router>
        <Route exact path="/" component={Game} />
        <Route path="/admin" component={Admin} />
      </Router>
    )
  }
}

export default App;
