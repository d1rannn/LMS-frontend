import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector
import Navbar from './Navbar';
import "../style/style.css";  // Import the updated style

function ModulePage() {
    const { id, moduleId } = useParams(); // id = courseId, moduleId = moduleId
    const navigate = useNavigate();

    // Get the user data from the Redux store
    const user = useSelector(state => state.user);

    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completed, setCompleted] = useState(false); // Track if module is completed

    useEffect(() => {
        if (!moduleId) return;

        // 1. Fetch the module details
        fetch(`http://localhost:8080/api/modules/${moduleId}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to load module");
                }
                return res.json();
            })
            .then(data => {
                setModule(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

        // 2. Check completion status from localStorage on page load
        const isCompletedInLocalStorage = localStorage.getItem(`module-${moduleId}-completed`) === 'true';
        setCompleted(isCompletedInLocalStorage);

        // 3. Fetch the current completion status for the module from the backend
        fetch(`http://localhost:8080/api/progress/${user.id}/course/${id}`)
            .then(res => res.json())
            .then(progressData => {
                const isCompletedInBackend = progressData.completedModules.includes(Number(moduleId));
                if (isCompletedInBackend) {
                    setCompleted(true);
                    localStorage.setItem(`module-${moduleId}-completed`, 'true');
                }
            })
            .catch(console.error);

    }, [moduleId, user, id]);

    const handleCompleteModule = () => {
        // 4. Mark module as completed and update the progress
        fetch(`http://localhost:8080/api/progress/${user.id}/course/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completedModuleId: moduleId
            })
        })
            .then(res => {
                if (res.ok) {
                    // Update the completed state locally
                    setCompleted(true);
                    localStorage.setItem(`module-${moduleId}-completed`, 'true'); // Save to localStorage
                    // Fetch updated progress to update the progress tracker
                    return fetch(`http://localhost:8080/api/progress/${user.id}/course/${id}`);
                }
                throw new Error('Failed to mark module as completed');
            })
            .then(res => res.json())
            .then(progressData => {
                console.log("Updated progress:", progressData);
            })
            .catch(error => {
                setError(error.message);
            });
    };

    if (loading) return <div className="text-center p-4">Loading module...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
    if (!module) return <div className="text-center p-4 text-red-500">Module not found</div>;

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content max-w-4xl mx-auto p-4">
                {/* Card Wrapper */}
                <div className="module-card shadow-lg rounded-lg p-6 bg-white">
                    <h1 className="text-2xl font-bold mb-3">{module.title}</h1>

                    {/* Video link placeholder */}
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">🎬 Video Lesson</h2>
                        {module.videoUrl ? (
                            <a
                                href={module.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Watch Video Lesson
                            </a>
                        ) : (
                            <p>No video available for this module.</p>
                        )}
                    </div>

                    {/* Content/Notes */}
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-1">📝 Notes</h2>
                        <p className="text-gray-800 whitespace-pre-line">
                            {module.content}
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-1">📁 Download File</h2>
                        {module.filePath ? (
                            <a
                                href={`http://localhost:8080/api/modules/${moduleId}/file/${module.filePath.split('/').pop()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Download File
                            </a>
                        ) : (
                            <p>No file available for this module.</p>
                        )}
                    </div>

                    {/* Show status for students */}
                    {user.role !== 'TEACHER' && (
                        <div className="text-center mt-4">
                            <p className={`font-semibold text-lg ${completed ? 'text-green-600' : 'text-red-600'}`}>
                                {completed ? 'Module Completed' : 'Module Not Completed'}
                            </p>
                        </div>
                    )}

                    {/* Button to mark as completed */}
                    {user.role !== 'TEACHER' && (
                        <div className="text-center mt-4">
                            <button
                                onClick={handleCompleteModule}
                                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ${completed ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                                disabled={completed}
                            >
                                {completed ? 'Module Completed' : 'Complete Module'}
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={() => navigate(-1)} // Navigate back to course or previous page
                        >
                            ← Back to Course
                        </button>
                    </div>
                </div>
                {/* End Card Wrapper */}
            </div>
        </div>
    );
}

export default ModulePage;