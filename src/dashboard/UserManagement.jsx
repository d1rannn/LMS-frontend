import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../style/userManagement.css";
import ConfirmModal from '../common/ConfirmModalAdmin';

function UserManagement() {
    const user = useSelector(state => state?.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userToBan, setUserToBan] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            console.log('Access denied: Invalid or non-admin user');
            navigate("/"); // Or another page such as /access-denied
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            fetch('http://localhost:8080/api/users')
                .then((res) => res.json())
                .then((data) => {
                    console.log('Fetched users:', data);
                    setUsers(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error fetching users:', err);
                    setLoading(false);
                });
        }
    }, [user]);

    const openModal = (userId) => {
        const userToBan = users.find((u) => u.id === userId);
        setUserToBan(userToBan);
        setShowModal(true);
    };

    // Function to close modal
    const closeModal = () => {
        setShowModal(false);
        setUserToBan(null);
    };

    // Ban user function
    const banUser = () => {
        fetch(`http://localhost:8080/api/users/${userToBan.id}/ban`, {
            method: 'PUT',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to ban user');
                return res.json();
            })
            .then(() => {
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.id === userToBan.id ? { ...u, banned: true } : u
                    )
                );
                closeModal();
            })
            .catch((err) => {
                console.error('Error banning user:', err);
                closeModal();
            });
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <div className="user-management">
            <h1 className="management-title">Manage Users</h1>
            <table className="user-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            {user.banned ? (
                                <span className="status-banned">Banned</span>
                            ) : (
                                <span className="status-active">Active</span>
                            )}
                        </td>
                        <td>
                            {user.banned ? (
                                <span className="banned-label">Banned</span>
                            ) : (
                                <button
                                    className="ban-btn"
                                    onClick={() => openModal(user.id)}
                                    disabled={user.role === 'ADMIN'}
                                >
                                    {user.role === 'ADMIN' ? 'Cannot Ban Admin' : 'Ban User'}
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {showModal && (
                <ConfirmModal
                    type="ban"
                    module={userToBan}
                    onConfirm={banUser}
                    onCancel={closeModal}
                />
            )}
        </div>
    );
}

export default UserManagement;