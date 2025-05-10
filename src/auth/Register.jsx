import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/style.css";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: ''
    });

    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (formData.username !== formData.username.toLowerCase().trim()) {
            showToast('Username must be lowercase and without spaces.', 'error');
            setFormData({ ...formData, username: '' });
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    role: 'USER'
                })
            });

            if (response.ok) {
                showToast('Registration successful!');
                setTimeout(() => navigate('/'), 1000); // brief delay to let toast show
            } else {
                const error = await response.text();
                showToast(error || 'Registration failed.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('An unexpected error occurred.', 'error');
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>

            {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    onChange={handleChange}
                    value={formData.name}
                    required
                />
                <input
                    name="username"
                    type="text"
                    placeholder="User Name"
                    onChange={handleChange}
                    value={formData.username}
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;