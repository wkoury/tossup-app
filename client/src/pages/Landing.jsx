import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="App">
            <Link to="/create">Create a Game</Link>
            <br></br>
            <Link to="/game">Join a Game</Link>
        </div>
    );
}

export default Landing;
