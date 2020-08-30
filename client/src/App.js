import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Game from "./pages/Game";
import Admin from "./pages/Admin";
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
