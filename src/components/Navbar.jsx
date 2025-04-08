import { useContext } from "react";
import { Link } from "react-router-dom";
import "../style/style.css";
import { AuthContext } from "../App";

function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
                {
                    user ? (
                        <>
                            <li><Link to="/courses">Courses</Link></li>
                            <li><button onClick={logout} className="button">Logout</button></li>
                        </>
                    ) : null
                }
            </ul>
        </nav>
    );
}

export default Navbar;