import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../App.css";

class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roomCount: ""
        };

        this.getRoomCount = this.getRoomCount.bind(this);
    }

    componentDidMount(){
        this.getRoomCount();
        setInterval(() => {
            this.getRoomCount();
        },5000);
    }

    getRoomCount = () => {
        axios.get("/api/roomCount").then(res => {
            this.setState({
                roomCount: res.data.count
            });
        });
    }

    render(){
        return(
            <React.Fragment>
                <Navbar />
                <div className="App">
                    <h3>Active rooms:</h3>
                    <p>{this.state.roomCount}</p>
                </div>
            </React.Fragment>
        );
    }
}

export default Dashboard;
