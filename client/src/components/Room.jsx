import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";

const Room = props => {
    const [loading, setLoading] = useState(".");
    
    useEffect(() => {
        setInterval(() => {
            loadingGraphic(setLoading);
        }, 600);
    },[loading]);
            

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
                    <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
                </div>
            </div>
        );
    }
}

const loadingGraphic = async(setLoading) => {
    setLoading("..");
    await sleep(200);
    setLoading("...");
    await sleep(200);
    setLoading(".");
    await sleep(200);
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export default Room;
