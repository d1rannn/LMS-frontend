import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/style.css';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: ''
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const notify = (title, body) => {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification(title, { body });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification(title, { body });
                    }
                });
            }
        } else {
            alert(body); // fallback if notifications not supported
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (formData.username !== formData.username.toLowerCase().trim()) {
            notify('Registration Error', 'Username must be lowercase and without spaces.');
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
                    role: 'STUDENT'
                })
            });

            if (response.ok) {
                notify('Success', 'Registration successful!');
                navigate('/');
            } else {
                const error = await response.text();
                notify('Registration Failed', error);
            }
        } catch (error) {
            console.error('Error:', error);
            notify('Error', 'An unexpected error occurred.');
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
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