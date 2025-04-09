import React, { useContext } from "react";
import '../style/style.css';
import Navbar from "./Navbar";
import { AuthContext } from "../App";

const HomePage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="home-container">
            <div className="text-center">
                <h1 className="display-4">Welcome to Our Platform</h1>
                <p className="lead">Your journey to learning starts here.</p>
                {user ? (
                    <h4>Hello, {user.name}. You have logged in as {user.role}</h4>
                ) : (
                    <h4>Please log in to see your details.</h4>
                )}
                <Navbar />
            </div>
        </div>
    );
};

export default HomePage;