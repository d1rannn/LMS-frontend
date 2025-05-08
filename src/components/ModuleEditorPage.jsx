import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import "../style/style.css";
import { useSelector } from "react-redux";
import ConfirmModal from './ConfirmModal';

function ModuleEditorPage() {
    const { moduleId } = useParams();

    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned || user.role === 'BANNED') {
            navigate('/banned');
        }
    }, [user, navigate]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/modules/${moduleId}`)
            .then(res => {
                if (!res.ok) throw new Error("Module not found");
                return res.json();
            })
            .then(data => {
                setModule(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load module");
                setLoading(false);
            });
    }, [moduleId]);

    const handleConfirmSave = () => {
        fetch(`http://localhost:8080/api/modules/${moduleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: module.title,
                content: module.content
            })
        })
            .then(res => res.json())
            .then(updatedModule => {
                setModule(updatedModule);
                setShowSaveModal(false);
                navigate(-1);
            })
            .catch(err => {
                setError('Failed to save module');
                setShowSaveModal(false);
            });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        fetch(`http://localhost:8080/api/modules/${moduleId}/upload`, {
            method: 'POST',
            body: formData,
        })
            .then(res => res.text())
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.error('Error uploading file:', err);
            });
    };

    if (loading) return <div className="text-center p-6">Loading module...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content max-w-4xl mx-auto p-6">
                <div className="edit-course">
                    <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">Editing Module: {module.title}</h1>

                    <label>Module Title</label>
                    <input
                        type="text"
                        value={module.title}
                        onChange={(e) => setModule({ ...module, title: e.target.value })}
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-600"
                    />

                    <label>Module Content</label>
                    <textarea
                        rows={6}
                        value={module.content}
                        onChange={(e) => setModule({ ...module, content: e.target.value })}
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-600"
                    />

                    <label>Upload File (optional)</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                    />
                    <button
                        onClick={handleFileUpload}
                        className="btn-primary w-full py-2 mt-2"
                    >
                        Upload File
                    </button>

                    <div className="text-center">
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="btn-primary w-full py-2 save-module-btn"
                        >
                            Save Module
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn-primary w-full py-2 back-to-edit-btn-btn"
                        >
                            Back to Edit Course
                        </button>
                    </div>
                </div>
            </div>

            {showSaveModal && (
                <ConfirmModal
                    type="save"
                    module={module}
                    onConfirm={handleConfirmSave}
                    onCancel={() => setShowSaveModal(false)}
                />
            )}
        </div>
    );
}

export default ModuleEditorPage;