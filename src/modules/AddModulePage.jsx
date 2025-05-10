import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../common/Navbar';
import "../style/style.css";
import ConfirmModalModule from "../common/ConfirmModalModule";

function AddModulePage() {
    const { id } = useParams(); // course ID
    const navigate = useNavigate();
    const user = useSelector(state => state?.user);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showAddModuleModal, setShowAddModuleModal] = useState(false);


    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned) {
            navigate('/banned');
        }
    }, [user, navigate]);

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (videoUrl.trim() !== '') {
            formData.append("videoUrl", videoUrl);
        }
        if (file) {
            formData.append("file", file);
        }

        fetch(`http://localhost:8080/api/courses/${id}/modules`, {
            method: 'POST',
            body: formData
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to add module");
                return res.json();
            })
            .then(() => {
                setSuccess("Module added successfully!");
                setTimeout(() => {
                    navigate(`/courses/${id}/edit`);
                }, 1500);
            })
            .catch(err => {
                setError(err.message);
                setTimeout(() => setError(null), 3000);
            });
    };

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content">
                <div className="edit-course">
                    <h1>Add Module to Course #{id}</h1>

                    <label>Module Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required />

                    <label>Content</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} required />

                    <label>Video URL (optional)</label>
                    <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />

                    <label>Upload File (optional)</label>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />

                    <div className="button-container" style={{ marginTop: '1rem' }}>
                        <button onClick={ () => {
                            handleSubmit();
                            setShowAddModuleModal(true);
                        }}>
                            📘 Save Module
                        </button>
                        <button onClick={() => navigate(`/courses/${id}/edit`)}>🔙 Cancel</button>
                    </div>
                </div>
            </div>

            {showAddModuleModal && (
                <ConfirmModalModule
                    module={module}
                    onConfirm={handleSubmit}
                    onCancel={() => setShowAddModuleModal(false)}
                />
            )}
        </div>
    );
}

export default AddModulePage;