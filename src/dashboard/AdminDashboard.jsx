import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "../style/admin-style.css";
import Navbar from "../common/Navbar";

function AdminDashboard() {
    const user = useSelector(state => state?.user);
    const navigate = useNavigate();

    if (!user || user.role !== 'ADMIN') {
        return <p>Access denied. You must be an administrator to view this page.</p>;
    }

    return (
        <div className="admin-dashboard">
            <Navbar />
            <div className="welcome-card">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <p className="welcome-message">Welcome, {user.name}!</p>
            </div>

            <div className="admin-actions">
                <div className="welcome-card">
                    <h2>Manage Users</h2>
                    <button className="action-btn"
                            onClick={() => navigate('/admin/users')}>
                        View Users</button>
                </div>

                <div className="welcome-card">
                    <h2>Manage Courses</h2>
                    <button className="action-btn"
                            onClick={() => navigate('/admin/courses')}>
                        View Courses</button>
                </div>

                <div className="welcome-card">
                    <h2>Manage Teachers</h2>
                    <button className="action-btn"
                            onClick={() => navigate('/admin/teachers')}>
                        Create Teachers</button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;