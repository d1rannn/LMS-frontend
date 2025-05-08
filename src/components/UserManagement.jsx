import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../style/userManagement.css";
import ConfirmModal from './ConfirmModalAdmin'; // Import the modal component

function UserManagement() {
    const user = useSelector(state => state?.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);  // State for modal visibility
    const [userToBan, setUserToBan] = useState(null);  // Store the user to be banned
    const navigate = useNavigate();

    // If the user is not an admin, redirect to another page
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            console.log('Access denied: Invalid or non-admin user');
            navigate("/"); // Or another page such as /access-denied
        }
    }, [user, navigate]);

    // Fetch users if the user is an admin
    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            fetchUsers(); // Call fetchUsers function to get the list of users
        }
    }, [user]); // Run this effect only when the user state changes

    // Function to fetch the users from the backend
    const fetchUsers = () => {
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
    };

    // Function to open modal
    const openModal = (userId) => {
        const userToBan = users.find((u) => u.id === userId);
        setUserToBan(userToBan);  // Set the user to be banned
        setShowModal(true);  // Show the modal
    };

    // Function to close modal
    const closeModal = () => {
        setShowModal(false);  // Hide the modal
        setUserToBan(null);    // Clear the user data
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
                // Update the user's banned status in the state
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.id === userToBan.id ? { ...u, banned: true } : u
                    )
                );
                closeModal();  // Close the modal after banning
            })
            .catch((err) => {
                console.error('Error banning user:', err);
                closeModal();  // Close modal on error as well
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
                    <th>Status</th> {/* New Status Column */}
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
                            {/* Display Banned or Active status */}
                            {user.banned ? (
                                <span className="status-banned">Banned</span>
                            ) : (
                                <span className="status-active">Active</span>
                            )}
                        </td>
                        <td>
                            {/* Display banned label or ban button depending on the user status */}
                            {user.banned ? (
                                <span className="banned-label">Banned</span>
                            ) : (
                                <button
                                    className="ban-btn"
                                    onClick={() => openModal(user.id)}  // Open modal on ban button click
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

            {/* Modal confirmation for banning */}
            {showModal && (
                <ConfirmModal
                    type="ban"
                    module={userToBan}  // Pass the user data for the modal
                    onConfirm={banUser}  // Confirm action
                    onCancel={closeModal}  // Cancel action
                />
            )}
        </div>
    );
}

export default UserManagement;