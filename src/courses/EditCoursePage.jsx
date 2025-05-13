import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../common/Navbar';
import "../style/style.css";
import ConfirmModalCourse from "../common/ConfirmModalCourse";

function EditCoursePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state?.user);

    const [course, setCourse] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modules, setModules] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showSaveCourseModal, setShowSaveCourseModal] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned) {
            navigate('/banned');
        }
    }, [user, navigate]);

    const fetchModules = () => {
        fetch(`http://localhost:8080/api/courses/${id}/modules`)
            .then(res => res.json())
            .then(setModules)
            .catch(console.error);
    };

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

            fetchModules();
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
        navigate(`/modules/${moduleId}/edit`);
    };

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content">
                <div className="edit-course">
                    <h1>Edit Course: {course?.title}</h1>

                    <label>Course Title</label>
                    <input value={title}
                           onChange={(e) => setTitle(e.target.value)} />

                    <label>Description</label>
                    <textarea value={description}
                              onChange={(e) => setDescription(e.target.value)} rows={6} />

                    <div className="button-container"
                         style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button onClick={ () => {
                            handleSaveCourse();
                            setShowSaveCourseModal(true);
                        }}>
                            Save Course
                        </button>
                        <button
                            onClick={() => navigate(`/courses/${id}/modules/edit`)}>
                            Edit Course Modules
                        </button>
                        <button onClick={() => {
                            if (user.role === 'TEACHER') {
                                navigate(`/courses/${course.id}`);
                            } else if(user.role === 'ADMIN') {
                                navigate(`/admin/courses`);
                            }
                        }}>
                            Back to Courses Page
                        </button>
                    </div>
                </div>
            </div>

            {showSaveCourseModal && (
                <ConfirmModalCourse
                    course={course}
                    onConfirm={handleSaveCourse}
                    onCancel={() => setShowSaveCourseModal(false)}
                />
            )}
        </div>
    );
}

export default EditCoursePage;