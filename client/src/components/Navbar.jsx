import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Navbar = () => {
    return(
        <div className="navbar">
            <Link to="/">Tossup</Link>
        </div>
    )
}

export default Navbar;
