import { useState } from 'react';
import Navbar from './Navbar';
import '../style/style.css';

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setToast({ message: 'Message sent successfully!', type: 'success' });
        setTimeout(() => setToast(null), 3000);
        setFormData({ name: '', email: '', message: '' });
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
                    <h1 className="display-4">Contact Us</h1>
                    <p className="lead">We'd love to hear from you! Please fill out the form below.</p>
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
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="message">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                        ></textarea>
                        <button type="submit" className="btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;