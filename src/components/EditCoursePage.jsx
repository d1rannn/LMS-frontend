import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import "../style/style.css";

function EditCoursePage() {
    const { id } = useParams();
    const navigate = useNavigate(); // Hook for navigation
    const user = useSelector(state => state?.user);

    const [course, setCourse] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modules, setModules] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned) {
            navigate('/banned');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:8080/api/teachers/${user.id}/courses/${id}`)
                .then(res => res.ok ? res.json() : Promise.reject("Course not found"))
                .then(data => {
                    setCourse(data);
                    setTitle(data.title);
                    setDescription(data.description);
                })
                .catch(setError);

            fetch(`http://localhost:8080/api/courses/${id}/modules`)
                .then(res => res.json())
                .then(setModules)
                .catch(console.error);
        }
    }, [id, user]);

    const handleSaveCourse = () => {
        fetch(`http://localhost:8080/api/courses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        })
            .then(res => res.ok ? res.json() : Promise.reject("Course update failed"))
            .then(data => {
                setCourse(data);
                setSuccess("Course updated successfully");
                setTimeout(() => setSuccess(null), 3000);
            })
            .catch(setError);
    };

    const handleModuleClick = (moduleId) => {
        // Navigate to the module's edit page
        navigate(`/modules/${moduleId}/edit`);
    };

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content">
                <div className="edit-course">
                    <h1>Edit Course: {course?.title}</h1>

                    <label>Course Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} />

                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />

                    <div className="button-container">
                        <button onClick={handleSaveCourse}>Save Course</button>
                        <button onClick={() => navigate(`/courses/${course.id}`)}>Back to Courses Page</button>
                    </div>

                    <hr className="my-6" />
                    <h2>Click to Module you want to edit</h2>

                    <div className="module-grid">
                        {modules.length === 0 && <p>No modules available.</p>}
                        {modules.map((mod) => (
                            <div
                                key={mod.id}
                                className="module-card"
                                onClick={() => handleModuleClick(mod.id)} // Navigate to module edit page on click
                            >
                                <h3 className="text-lg font-semibold mb-1">📘 {mod.title}</h3>
                                <p className="text-gray-700">{mod.content}</p>
                            </div>
                        ))}
                    </div>

                    {success && <p className="text-green-500 mt-4">{success}</p>}
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default EditCoursePage;