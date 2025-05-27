import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../common/Navbar';
import "../style/style.css";

function EditCourseModules() {
    const { id } = useParams(); // courseId
    const navigate = useNavigate();
    const user = useSelector(state => state?.user);

    const [modules, setModules] = useState([]);
    const [courseTitle, setCourseTitle] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned) {
            navigate('/banned');
        }
    }, [user, navigate]);

    useEffect(() => {
        // Fetch course info
        fetch(`http://localhost:8080/api/courses/${id}`)
            .then(res => res.json())
            .then(data => setCourseTitle(data.title))
            .catch(err => console.error("Failed to load course title", err));

        // Fetch modules
        fetch(`http://localhost:8080/api/courses/${id}/modules`)
            .then(res => res.json())
            .then(setModules)
            .catch(setError);
    }, [id]);

    const handleEditClick = (moduleId) => {
        navigate(`/modules/${moduleId}/edit`);
    };

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content">
                <div className="welcome-card">
                    <h1>Edit Modules for Course: <span className="text-indigo-700">{courseTitle}</span></h1>
                </div>

                {error && <p className="text-red-500">Error: {error}</p>}

                <div className="module-card">
                    <div className="module-grid">
                        {modules.length === 0 ? (
                            <p>No modules found.</p>
                        ) : (
                            modules.map((mod) => (
                                <div className="module-card" key={mod.id}>
                                    <h2>{mod.title}</h2>
                                    <p>{mod.content}</p>
                                    <button className="edit-btn" onClick={() => handleEditClick(mod.id)}>
                                        Edit Module
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="card-button-group mt-6">
                    <button
                        className="back-to-edit-btn"
                        onClick={() => navigate(`/courses/${id}/edit`)}>
                        Back
                    </button>
                    <button
                        className="view-btn"
                        onClick={() => navigate(`/courses/${id}/modules/create`)}>
                        Add Module
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditCourseModules;