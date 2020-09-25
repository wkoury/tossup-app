import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="landing">
            <h1>Tossup</h1>
            <p className="subtitle">An easy buzzer system for quiz bowl.</p>
            <Link to="/create">Create a Game</Link>
            <br></br>
            <Link to="/join">Join a Game</Link>
        </div>
    );
}

export default Landing;
