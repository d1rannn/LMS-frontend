import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // Import bcryptjs for hashing the password
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

        // Hash the password using bcrypt before sending it to the server
        const hashedPassword = bcrypt.hashSync(formData.password, 10); // 10 is the salt rounds

        const newUser = {
            ...formData,
            // Save the hashed password
            password: hashedPassword,
            role: 'user', // Default role for new users
            registredCourses: [] // Initialize with an empty array
        };

        if (formData.username !== formData.username.toLowerCase().trim()) {
            alert('Username must be in lowercase and without spaces.');
            setFormData({ ...formData, username: '' });
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser) // Send the user data with hashed password
            });

            if (response.ok) {
                const user = await response.json();
                alert('Registration successful!');
                navigate('/');
            } else {
                alert('Registration failed!');
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