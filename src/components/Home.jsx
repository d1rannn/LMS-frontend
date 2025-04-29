import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import "../style/style.css";

function Home() {
    const location = useLocation();
    const [toast, setToast] = useState(null);

    // Grab the user directly from Redux state.auth.user
    const user = useSelector(state => state.auth?.user);

    useEffect(() => {
        if (location.state && location.state.toastMessage) {
            setToast({ message: location.state.toastMessage, type: "success" });
            setTimeout(() => setToast(null), 3000);
        }
    }, [location.state]);

    return (
        <div className="wrapper">
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            <Navbar />
            <div className="main-content">
                <h1 className="display-4">Welcome to Our Platform</h1>
                <p className="lead">Your journey to learning starts here.</p>
                {user ? (
                    <h4>Hello, {user.name}. You have logged in as {user.role}</h4>
                ) : (
                    <h4>Please log in to see your details.</h4>
                )}
            </div>
        </div>
    );
}

export default Home;