import { useContext, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import React from "react"; // For React.memo
import "../style/home.css";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    const handleMouseEnter = () => setIsExpanded(true);
    const handleMouseLeave = () => setIsExpanded(false);

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
                        {(user.role !== "teacher" && user.role !== "admin") &&
                            renderLink("/courses", "📚", "Курсы")}

                        {user.role === "student" &&
                            renderLink("/my-courses", "🎓", "Мои курсы")}

                        {user.role === "teacher" &&
                            renderLink("/my-teaching-courses", "👩‍🏫", "Мои предметы")}

                        {user.role === "admin" && (
                            <>
                                {renderLink("/admin", "🛠️", "Панель Админа")}
                                {renderLink("/admin-course-manager", "📚", "Курсы (Admin)")}
                            </>
                        )}

                        <button onClick={logout} className="nav-link logout-button">
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
            </nav>
        </aside>
    );
}

export default React.memo(Navbar);