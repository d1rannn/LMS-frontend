import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import "../style/style.css";
import {useSelector} from "react-redux";

function TeacherManagement() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });

    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const user = useSelector(state => state?.user);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned || user.role === 'BANNED') {
            navigate('/banned');
        }
    }, [user, navigate]);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.username !== formData.username.toLowerCase().trim()) {
            showToast('Username must be lowercase and without spaces.', 'error');
            setFormData({ ...formData, username: '' });
            return;
        }

        fetch('http://localhost:8080/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                role: 'TEACHER',
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to create teacher');
                return res.json();
            })
            .then(() => {
                showToast("Teacher account created!");
                setFormData({
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                });
                navigate('/admin');
            })
            .catch(err => {
                console.error(err);
                showToast("Error creating teacher account", 'error');
            });
    };

    return (
        <>
            <Navbar />
            <div className="form-container">
                <h2>Create Teacher</h2>

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
                        placeholder="Username"
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
                    <button type="submit">Create Teacher</button>
                </form>
            </div>
        </>
    );
}

export default TeacherManagement;