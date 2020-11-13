import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Navbar = props => {
    if(props.needsLessMargin){
        return(
            <div className="navbar"
                style={{
                    paddingBottom: "20px"
                }}>
                <Link to="/">Tossup</Link>
            </div>
        );
    }else{
        return(
            <div className="navbar">
                <Link to="/">Tossup</Link>
            </div>
        );
    }
}

export default Navbar;
