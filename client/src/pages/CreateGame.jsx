import React from "react";
import { Link } from "react-router-dom";

/*
    TODO: we still need to implement multiple game formats
*/

const CreateGame = () => {
    return (
        <div className="App">
            {/* <Link>No Teams</Link> */}
            <br></br>
            <Link to="/admin">Random Teams</Link> {/* FIXME we need to change this a ton */}
            <br></br>
            {/* <Link>Selected Teams</Link> */}
        </div>
    );
}

export default CreateGame;
