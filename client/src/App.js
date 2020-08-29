import React from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      connected: ""
    }
  }
  
  componentDidMount() {
    axios.get("/api/ping")
    .then(res => {
      this.setState({
        connected: res.data
      });
    })
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          
          <span>{this.state.connected}</span>
        </header>
      </div>
    );
  }
}

export default App;
