import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="App">
                <div className="about">
                    <p>Tossup is an easy online buzzer system for both virtual and in-person events. </p>
                    <p>Easier to set up and far cheaper than a traditional lockout buzzer, it was created by <a href="https://wkoury.com" rel="noopener noreferrer" target="_blank">Will Koury</a> when he found how unintuitive and clunky other online systems felt.</p>
                    <p>Tossup and all of its features are free to use and will remain so for the foreseeable future.</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default About;
