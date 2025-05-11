import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../common/Navbar';
import "../style/style.css";

function ModulePage() {
    const { id, moduleId } = useParams();
    const courseIdNum = Number(id);
    const moduleIdNum = Number(moduleId);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const [module, setModule]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const fetchProgress = () => {
        fetch(`http://localhost:8080/api/progress/${user.id}/course/${courseIdNum}`, {
            cache: "no-cache"
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to load progress");
                return res.json();
            })
            .then(data => {
                const normalized = (data.completedModules || []).map(Number);
                dispatch({
                    type: 'SET_PROGRESS',
                    payload: { courseId: courseIdNum, completedModules: normalized }
                });
            })
            .catch(console.error);
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned || user.role === 'BANNED') {
            navigate('/banned');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!moduleId) return;

        setLoading(true);
        fetch(`http://localhost:8080/api/modules/${moduleIdNum}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            cache: "no-cache"
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to load module");
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

        fetchProgress();
    }, [moduleIdNum, user.id, courseIdNum, dispatch]);

    const handleCompleteModule = () => {
        fetch(
            `http://localhost:8080/api/progress/${user.id}/course/${courseIdNum}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completedModuleId: moduleIdNum })
            }
        )
            .then(res => {
                if (!res.ok) throw new Error("Failed to save completion");
                return res.json();
            })
            .then(() => fetchProgress())
            .catch(err => setError(err.message));
    };

    if (loading) return <div className="text-center p-4">Loading module...</div>;
    if (error)   return <div className="text-center p-4 text-red-500">{error}</div>;
    if (!module) return <div className="text-center p-4 text-red-500">Module not found</div>;

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content max-w-4xl mx-auto p-4">
                <div className="module-card shadow-lg rounded-lg p-6 bg-white">
                    <h1 className="text-2xl font-bold mb-3">{module.title}</h1>
                </div>

                <div className="module-card shadow-lg rounded-lg p-6 bg-white">
                    <div className="module-card shadow-lg rounded-lg p-6 bg-white">
                        <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">🎬 Video Lesson</h2>
                            {module.videoUrl
                                ? <a
                                    href={module.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Watch Video Lesson
                                </a>
                                : <p>No video available for this module.</p>}
                        </div>
                    </div>

                    <div className="module-card shadow-lg rounded-lg p-6 bg-white">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-1">📝 Notes</h2>
                            <p className="text-gray-800 whitespace-pre-line">
                                {module.content}
                            </p>
                        </div>
                    </div>

                    <div className="module-card shadow-lg rounded-lg p-6 bg-white">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-1">📁 Download File</h2>
                            {module.filePath
                                ? <a
                                    href={`http://localhost:8080/api/modules/${moduleIdNum}/file/${module.filePath.split('/').pop()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Download File
                                </a>
                                : <p>No file available for this module.</p>}
                        </div>
                    </div>

                    {user.role !== 'TEACHER' && (
                        <div className="text-center mt-4">
                            <button
                                onClick={handleCompleteModule}
                                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-200"
                            >
                                ✔️ Complete Module
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={() => navigate(-1)}
                        >
                            ← Back to Course
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModulePage;