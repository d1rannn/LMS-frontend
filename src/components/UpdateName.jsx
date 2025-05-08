import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../style/profile.css';

function UpdateName() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ name: '', avatar: null, avatarUrl: '' });
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned || user.role === 'BANNED') {
            navigate('/banned');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/users/${user.id}`);
                    const responseData = await response.json();
                    if (response.ok) {
                        setFormData({
                            name: responseData.name || '',
                            avatarUrl: responseData.avatarUrl || '/uploads/avatars/default-avatar.jpg',
                            avatar: null,
                        });
                    } else {
                        setToast({ message: 'Failed to fetch user data', type: 'error' });
                    }
                } catch (error) {
                    setToast({ message: error.message, type: 'error' });
                }
            };
            fetchUserData();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarSelect = (e) => {
        if (e.target.files.length > 0) {
            setFormData({ ...formData, avatar: e.target.files[0] });
        }
    };

    const handleAvatarChange = async (e) => {
        e.preventDefault();

        if (!formData.avatar) {
            setToast({ message: "Please select an avatar image", type: "error" });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('avatar', formData.avatar);

        try {
            const response = await fetch(`http://localhost:8080/api/users/update-avatar`, {
                method: 'PUT',
                headers: {
                    'User-Id': user.id,
                },
                body: formDataToSend,
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to upload avatar');
            }

            setFormData(prev => ({
                ...prev,
                avatarUrl: responseData.avatarUrl,
                name: responseData.name,
                avatar: null
            }));

            dispatch({ type: 'UPDATE_USER', payload: responseData });

            setToast({ message: 'Avatar updated successfully!', type: 'success' });
            setTimeout(() => setToast(null), 3000);

        } catch (error) {
            setToast({ message: error.message, type: 'error' });
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/users/update`, {
                method: 'PUT',
                headers: {
                    'User-Id': user.id,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: formData.name }),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update name');
            }

            setFormData(prev => ({
                ...prev,
                name: responseData.name
            }));

            dispatch({ type: 'UPDATE_USER', payload: responseData });

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
            {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
            <Navbar />
            <div className="main-content">
                <div className="contact-us-container">
                    <h1 className="display-4">Update Your Name and Avatar</h1>

                    <form className="contact-us-form" onSubmit={handleSubmit}>
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

                    <div className="avatar-section">
                        <h2>Current Avatar</h2>
                        <div className="avatar-preview">
                            <img
                                src={`http://localhost:8080${formData.avatarUrl}`}
                                alt="Avatar"
                                className="avatar-img"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/default-avatar.png";
                                }}
                            />
                        </div>

                        <div className="avatar-upload">
                            <label htmlFor="avatar" className="upload-label">Choose New Avatar</label>
                            <input
                                type="file"
                                id="avatar"
                                name="avatar"
                                accept="image/*"
                                onChange={handleAvatarSelect}
                            />
                            <button onClick={handleAvatarChange} className="btn-primary update-avatar-btn">
                                Upload Avatar
                            </button>
                        </div>
                    </div>

                    <button className="btn-secondary" onClick={() => navigate(`/profile/${user.id}`)}>
                        Back to Profile
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateName;