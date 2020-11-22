import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Loader from "react-loader-spinner";
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
                    <h3>Open rooms:</h3>
                    {this.state.roomCount === "" ? <Loader type="ThreeDots" color="#FFFFFF" height={80} width={80} /> : <p>{this.state.roomCount}</p>}
                </div>
            </React.Fragment>
        );
    }
}

export default Dashboard;
