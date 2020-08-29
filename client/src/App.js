import React from "react";
import io from "socket.io-client";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      login: false,
      players: []
    };

    this.socket = io();

    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.socket.on("login", data => {
      this.setState({
        players: data
      });
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleLogin = (event) => {
    event.preventDefault();
    if (this.state.name !== "") {
      this.setState({
        login: true
      });
      this.socket.emit("login",
        {
          name: this.state.name,
          key: Date.now()
        },
        () => {/* callback function */ });
    }
  };

  render() {
    return (
      <div className="App">
        {this.state.login === false ? (
          <div className="initialization">
            <h4>Enter your name:</h4>
            <div className="form-fields">
              <input
                className="name-input"
                type="text"
                placeholder="Name"
                name="name"
                value={this.state.name}
                onChange={e => this.handleChange(e)}
              ></input>
              <button
                className="name-submit"
                onClick={(e) => this.handleLogin(e)}
              >
                Join
              </button>
            </div>
          </div>
        ) : (
            <div>
              <div>
                <button className="buzzer">Buzz</button>
              </div>
              <h4>Connected players:</h4>
              {this.state.players.map(player => <p key={player.key}>{player.name}</p>)}
            </div>
          )}
      </div>
    );
  }
}

export default App;
