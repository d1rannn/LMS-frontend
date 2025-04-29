import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/style.css';  // Import custom CSS for the registration page

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

    const handleSubmit = async e => {
        e.preventDefault();

        if (formData.username !== formData.username.toLowerCase().trim()) {
            alert('Username must be in lowercase and without spaces.');
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
                    role: 'STUDENT' // or "USER", depending on your backend
                })
            });

            if (response.ok) {
                alert('Registration successful!');
                navigate('/');
            } else {
                const error = await response.text();
                alert(`Registration failed: ${error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
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