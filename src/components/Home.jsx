import { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { clearLoginFlag } from '../store/authActions';
import Navbar from './Navbar';
import "../style/style.css";

function Home() {
    const justLoggedIn = useSelector(state => state.justLoggedIn);
    const dispatch = useDispatch();
    const [toast, setToast] = useState(null);

    // Grab the user directly from Redux state.auth.user
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (justLoggedIn) {
            setToast({ message: "Login successful!", type: "success" });
            setTimeout(() => setToast(null), 3000);
            dispatch(clearLoginFlag()); // reset after showing
        }
    }, [justLoggedIn, dispatch]);

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