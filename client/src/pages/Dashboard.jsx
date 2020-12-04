import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Loader from "react-loader-spinner";
import "../App.css";

class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            roomCount: "",
            roomsCreated: ""
        };

        this.getData = this.getData.bind(this);
    }

    componentDidMount(){
        this.getData();
        setInterval(() => {
            this.getData();
        },5000);
    }

    getData = () => {
        axios.get("/api/roomCount").then(res => {
            this.setState({
                roomCount: res.data.count
            });
        });

        axios.get("/api/roomsCreated").then(res => {
            this.setState({
                roomsCreated: res.data.count
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

                    <h3>Rooms created since last server restart:</h3>
                    <span style={{
                        fontSize: "0.7rem"
                    }}>
                        (The server is restarted nightly and when changes are pushed)
                    </span>
                    {this.state.roomsCreated === "" ? <Loader type="ThreeDots" color="#FFFFFF" height={80} width={80} /> : <p>{this.state.roomsCreated}</p>}
                </div>
            </React.Fragment>
        );
    }
}

export default Dashboard;
