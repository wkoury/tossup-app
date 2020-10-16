import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="landing">
            <h1>Tossup</h1>
            <p className="subtitle">An easy online buzzer system.</p>
            <Link to="/join">Join a Game</Link>
            <br></br>
            <Link to="/create">Create a Game</Link>
            <p className="byline">Created by <a href="https://wkoury.com" rel="noopener noreferrer" target="_blank">Will Koury</a>.</p>
        </div>
    );
}

export default Landing;
