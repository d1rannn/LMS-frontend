import React from "react";
import '../style/style.css';
import Navbar from "./Navbar";

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="text-center">
                <h1 className="display-4">Welcome to Our Platform</h1>
                <p className="lead">Your journey to learning starts here.</p>
                <Navbar />
            </div>
        </div>
    );
};

export default HomePage;