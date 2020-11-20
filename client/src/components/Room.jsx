import React from "react";
import Loader from "react-loader-spinner";

const Room = props => {
    if(props.room){
        return(
            <div className="room">
                <p>Game Room:</p>
                <h2>{props.room}</h2>
            </div>
        );
    }else{
        return(
            <div className="room">
                <div className="loading">
                    <p>Game Room:</p>
                    <Loader type="ThreeDots" color="#FFFFFF" height={80} width={80} />
                </div>
            </div>
        );
    }
}

export default Room;
