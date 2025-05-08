import {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../style/profile.css';

function ChangePassword() {
    const user = useSelector(state => state.user);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned) {
            navigate('/banned');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = formData;

        try {
            if (newPassword !== confirmPassword) {
                throw new Error('Passwords do not match!');
            }

            const response = await fetch('http://localhost:8080/api/users/change-password', {
                method: 'POST',
                headers: {
                    'User-Id': user.id,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Failed to change password');
            }

            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setToast({ message: 'Password changed successfully!', type: 'success' });
            setTimeout(() => setToast(null), 3000);

            navigate(`/profile/${user.id}`);
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
            setTimeout(() => setToast(null), 3000);
        }
    };

    return (
        <div className="wrapper">
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}
            <Navbar />
            <div className="main-content">
                <div className="contact-us-container">
                    <h1 className="display-4">Change Your Password</h1>
                    <form className="contact-us-form" onSubmit={handleChangePassword}>
                        <label htmlFor="currentPassword">Current Password:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="btn-primary change-password-btn">Change Password</button>
                    </form>
                    <button className="btn-secondary" onClick={() => navigate(`/profile/${user.id}`)}>Back to Profile</button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;