import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/actions/authActions';
import "../style/style.css";

function Navbar() {
    const user = useSelector(state => state?.user);
    const dispatch = useDispatch();
    const location = useLocation();

    const [isExpanded, setIsExpanded] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
    };

    const renderLink = useCallback(
        (to, emoji, label) => {
            const isActive = location.pathname === to;
            return (
                <Link to={to} className={`nav-link ${isActive ? "active" : ""}`}>
                    <span className="nav-icon">{emoji}</span>
                    <span className="nav-label">{label}</span>
                </Link>
            );
        },
        [location.pathname]
    );

    return (
        <aside
            className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="sidebar-logo">🧠</div>

            <nav className="sidebar-nav">
                {renderLink("/", "🏠", "Home")}

                {user ? (
                    <>
                        {(user.role !== "TEACHER" && user.role !== "ADMIN") &&
                            renderLink("/courses", "📚", "Courses")}

                        {user.role === "STUDENT" &&
                            renderLink("/student/courses", "🎓", "My courses")}

                        {user.role === "TEACHER" &&
                            renderLink("/teacher/courses", "👩‍🏫", "My teaching Courses")}

                        {user.role === "ADMIN" && (
                            <>
                                {renderLink("/admin", "🛠️", "Admin Panel")}
                                {renderLink("/admin-course-manager", "📚", "Courses (Admin)")}
                            </>
                        )}

                        {/* Profile Link */}
                        {renderLink(`/profile/${user.id}`, "👤", "Profile")}

                        <button onClick={handleLogout} className="nav-link logout-button">
                            <span className="nav-icon">🚪</span>
                            <span className="nav-label">Выйти</span>
                        </button>
                    </>
                ) : (
                    <>
                        {renderLink("/register", "📝", "Регистрация")}
                        {renderLink("/login", "🔑", "Войти")}
                    </>
                )}

                {user && isExpanded && (
                    <h4 style={{ color: '#333', paddingLeft: '1rem' }}>Роль: {user.role}</h4>
                )}
            </nav>
        </aside>
    );
}

export default Navbar;