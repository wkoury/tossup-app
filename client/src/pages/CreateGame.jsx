import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const CreateGame = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="App">
                <Link to="/admin/default">No Teams</Link>
                <br></br>
                <Link to="/admin/teams">Random Teams</Link>
                <br></br>
                <Link to="admin/custom">Custom Teams (Alpha)</Link>
            </div>
        </React.Fragment>
    );
}

export default CreateGame;
