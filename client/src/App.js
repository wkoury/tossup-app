import React from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io();

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: ""
    }

    this.handleLogin = this.handleLogin.bind(this);
  }
  
  componentDidMount() {
    
  }

  handleLogin = event => {
    event.preventDefault();
    this.setState(({
      name: event.target.value
    }));
  }
  
  render() {
    return (
      <div className="App">
        {this.state.name==="" ? (
          <div className="initialization">
            <h4>Enter your name:</h4>
            <div className="form-fields">
              <input className="name-input" type="text" placeholder="Name"></input>
              <button className="name-submit" name="name" onClick={e => this.handleLogin(e)}>Join</button>
            </div>
          </div>
        ) : (
          <p>Welcome!</p>
        )}
      </div>
    );
  }
}

export default App;
