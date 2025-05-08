import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../style/profile.css';

function Profile() {
    const user = useSelector(state => state?.user);
    const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png');

    useEffect(() => {
        const fetchAvatar = async () => {
            if (user && user.id) {
                try {
                    const response = await fetch(`http://localhost:8080/api/users/${user.id}`);
                    const data = await response.json();
                    if (response.ok && data.avatarUrl) {
                        setAvatarUrl(`http://localhost:8080${data.avatarUrl}`);
                    } else {
                        setAvatarUrl('/default-avatar.png');
                    }
                } catch (error) {
                    console.error("Failed to fetch avatar:", error);
                    setAvatarUrl('/default-avatar.png');
                }
            }
        };

        fetchAvatar();
    }, [user]);

    if (!user) {
        return (
            <div className="wrapper">
                <Navbar />
                <div className="main-content">
                    <h1 className="display-4">Profile</h1>
                    <p className="lead">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="wrapper">
            <Navbar />
            <div className="main-content">
                <div className="profile-card">
                    <h1 className="profile-title">Your Profile</h1>

                    <div className="profile-info">
                        <div className="profile-avatar">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/default-avatar.png";
                                }}
                            />
                        </div>

                        <div className="profile-text">
                            <h2>{user.name}</h2>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                        </div>
                    </div>

                    <div className="profile-buttons">
                        <Link to={`/profile/${user.id}/update-name`} className="btn update-btn">Update Name & Avatar</Link>
                        <Link to={`/profile/${user.id}/change-password`} className="btn password-btn">Change Password</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;