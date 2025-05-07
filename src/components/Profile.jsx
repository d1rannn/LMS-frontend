import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../style/profile.css';

function Profile() {
    const user = useSelector(state => state.user);

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
                <div className="contact-us-container">
                    <h1 className="display-4">Your Profile</h1>
                    <p className="lead">View and manage your account details.</p>
                    <div className="profile-details">
                        <h3>Account Information</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                    </div>
                    <div className="profile-actions">
                        <Link to={`/profile/${user.id}/update-name`} className="btn-primary update-name-btn">Update Name</Link>
                        <Link to={`/profile/${user.id}/change-password`} className="btn-primary change-password-btn">Change Password</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;