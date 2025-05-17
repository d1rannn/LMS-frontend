import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../common/Navbar';
import ProgressTracker from '../dashboard/ProgressTracker';
import "../style/style.css";

function CoursePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state?.user);

    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const location = useLocation();
    const toast = location.state?.toast;

    const [showToast, setShowToast] = useState(!!location.state?.toast);

    useEffect(() => {
        if (showToast) {
            const timeout = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timeout);
        }
    }, [showToast]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned) {
            navigate('/banned');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user || !user.role) {
            return <div>Loading...</div>;
        }

        fetch(`http://localhost:8080/api/courses/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load course");
                return res.json();
            })
            .then(data => setCourse(data))
            .catch(console.error);

        fetch(`http://localhost:8080/api/courses/${id}/modules`)
            .then(res => res.json())
            .then(setModules)
            .catch(console.error);

        fetch(`http://localhost:8080/api/students/user/${user.id}`)
            .then(res => res.json())
            .then(data => {
                const enrolled = data.enrolledCourses.some(c => c.id === parseInt(id));
                setIsEnrolled(enrolled);
                setLoading(false);
                if (!enrolled) {
                    navigate("/courses");
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        fetch(`http://localhost:8080/api/progress/${user.id}/course/${id}`)
            .then(res => res.json())
            .then(progressData => {
                setProgress(progressData.percentageCompleted);
            })
            .catch(console.error);

    }, [id, user, navigate]);

    if (loading || !course) return <div className="text-center p-4">Loading course...</div>;

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content max-w-3xl mx-auto p-6">
                <div className="welcome-card">
                    <h1>Course name: {course.title}</h1>
                    <h3>Course description: </h3>
                    <p>{course.description}</p>
                </div>

                {user && user.role !== 'TEACHER' && (
                    <ProgressTracker progress={progress} />
                )}

                <div className="course-card-container">
                    <div className="module-card">
                        <h2>📚 Course Modules</h2>

                        {modules.length === 0 ? (
                            <p className="note">No modules available yet.</p>
                        ) : (
                            <div className="module-grid">
                                {modules.map((mod, index) => (
                                    <div className="module-card" key={mod.id}>
                                        <h3 className="text-lg font-semibold mb-1">📘 {mod.title}</h3>
                                        <p className="text-gray-700 mb-2">{mod.content}</p>
                                        <button
                                            className="view-btn"
                                            onClick={() => navigate(`/courses/${id}/modules/${mod.id}`)}
                                        >
                                            View Module
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="text-center mt-6">
                            <button
                                className="bg-gray-400 hover:bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    if (user?.role === 'STUDENT') {
                                        navigate('/student/courses');
                                    } else if (user?.role === 'TEACHER') {
                                        navigate('/teacher/courses');
                                    } else {
                                        navigate('/');
                                    }
                                }}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {toast && (
                <div className="toast success">
                    {toast}
                </div>
            )}

            {showToast && (
                <div className="toast success">
                    {location.state.toast}
                </div>
            )}
        </div>
    );
}

export default CoursePage;