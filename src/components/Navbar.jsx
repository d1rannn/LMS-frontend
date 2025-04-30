import {useState, useCallback, useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authActions';
import "../style/home.css";

function Navbar() {
    const user = useSelector(state => state.user);

    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    const handleMouseEnter = () => setIsExpanded(true);
    const handleMouseLeave = () => setIsExpanded(false);

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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="sidebar-logo">🧠</div>
            <nav className="sidebar-nav">
                {renderLink("/", "🏠", "Главная")}

                {user ? (
                    <>
                        {(user.role !== "TEACHER" && user.role !== "ADMIN") &&
                            renderLink("/courses", "📚", "Курсы")}

                        {user.role === "STUDENT" &&
                            renderLink("/my-courses", "🎓", "Мои курсы")}

                        {user.role === "TEACHER" &&
                            renderLink("/my-teaching-courses", "👩‍🏫", "Мои предметы")}

                        {user.role === "ADMIN" && (
                            <>
                                {renderLink("/admin", "🛠️", "Панель Админа")}
                                {renderLink("/admin-course-manager", "📚", "Курсы (Admin)")}
                            </>
                        )}

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
                {user && <h4 style={{ color: 'white' }}>Logged in as: {user.role}</h4>}
            </nav>
        </aside>
    );
}

export default Navbar;