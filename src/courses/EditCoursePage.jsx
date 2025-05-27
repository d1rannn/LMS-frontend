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

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadError, setUploadError] = useState(null);

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
        uploadImage().then(imageUrl => {
            // Include imageUrl in course update if uploaded
            const body = {
                title,
                description,
            };
            if (imageUrl) body.imageUrl = imageUrl;

            fetch(`http://localhost:8080/api/courses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
                .then(res => (res.ok ? res.json() : Promise.reject("Course update failed")))
                .then(data => {
                    setCourse(data);
                    navigate(`/courses/${id}`, {
                        state: { toast: "Course updated successfully!" },
                    });
                })
                .catch(setError);
        });
    };

    const uploadImage = () => {
        if (!selectedFile) return Promise.resolve(null);

        const formData = new FormData();
        formData.append("file", selectedFile);

        return fetch(`http://localhost:8080/api/courses/${id}/upload-image`, {
            method: 'POST',
            body: formData,
        })
            .then(res => {
                if (!res.ok) throw new Error("Image upload failed");
                return res.json(); // assuming it returns { imageUrl: '...' }
            })
            .then(data => data.imageUrl)
            .catch(err => {
                setUploadError(err.message);
                return null;
            });
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

                    <label>Course Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />

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
                                navigate(`/teacher/courses`);
                            } else if(user.role === 'ADMIN') {
                                navigate(`/admin/courses`);
                            }
                        }}>
                            Back
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