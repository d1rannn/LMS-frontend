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

                {user ? (
                    <>
                        {(user.role !== "teacher") &&
                            (user.role !== "admin") && <li><Link to="/courses">Courses</Link></li>}

                        {user.role === "admin" && (
                            <>
                                <li><Link to="/admin">Admin Dashboard</Link></li>
                                <li><Link to="/admin-course-manager">Admin Course Manager</Link></li>
                            </>
                        )}

                        {user.role === "student" && (
                            <li><Link to="/my-courses">My Courses</Link></li>
                        )}

                        {user.role === "teacher" && (
                            <li><Link to="/my-teaching-courses">My Teaching Courses</Link></li>
                        )}

                        <li>
                            <button onClick={logout} className="button">Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;