import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../style/profile.css';

function UpdateName() {
    const user = useSelector(state => state.user);
    const [formData, setFormData] = useState({ name: '' });
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name || '' });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateName = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/users/update', {
                method: 'PUT',
                headers: {
                    'User-Id': user.id,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: formData.name })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Failed to update name');
            }

            const updatedUser = await response.json();
            setFormData({ name: updatedUser.name });
            setToast({ message: 'Name updated successfully!', type: 'success' });
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
                    <h1 className="display-4">Update Your Name</h1>
                    <form className="contact-us-form" onSubmit={handleUpdateName}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="btn-primary update-name-btn">Update Name</button>
                    </form>
                    <button className="btn-secondary" onClick={() => navigate(`/profile/${user.id}`)}>Back to Profile</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateName;