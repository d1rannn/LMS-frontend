import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function ModuleEditorPage() {
    const { moduleId } = useParams();
    const navigate = useNavigate();

    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the module details for editing
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
                console.error(err);
                setError("Failed to load module");
                setLoading(false);
            });
    }, [moduleId]);

    const handleSaveModule = () => {
        // Save the changes to the module
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
                navigate(-1); // Navigate back after saving
            })
            .catch(err => {
                setError('Failed to save module');
            });
    };

    if (loading) return <div className="text-center p-6">Loading module...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Editing Module: {module.title}</h1>

                {/* Module Title */}
                <label>Module Title</label>
                <input
                    type="text"
                    value={module.title}
                    onChange={(e) => setModule({ ...module, title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                />

                {/* Module Content */}
                <label>Module Content</label>
                <textarea
                    rows={6}
                    value={module.content}
                    onChange={(e) => setModule({ ...module, content: e.target.value })}
                    className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                />

                <div className="text-center">
                    <button
                        onClick={handleSaveModule}
                        className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
                    >
                        Save Module
                    </button>
                </div>

                <div className="text-center mt-4">
                    <button
                        onClick={() => navigate(-1)} // Navigate back to course or previous page
                        className="bg-gray-400 text-white px-6 py-2 rounded"
                    >
                        Back to Course
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModuleEditorPage;