import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../style/style.css";
import ConfirmModalCourse from "../common/ConfirmModalCourse";

function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        teacherId: '',
    });

    const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);

    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        fetch('http://localhost:8080/api/courses')
            .then(res => res.json())
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching courses:', err);
                setLoading(false);
            });

        fetch('http://localhost:8080/api/teachers')
            .then(res => res.json())
            .then(data => setTeachers(data))
            .catch(err => console.error('Error fetching teachers:', err));
    }, []);

    const handleChange = (e) => {
        setNewCourse({
            ...newCourse,
            [e.target.name]: e.target.value,
        });
    };

    const handleTeacherChange = (e) => {
        setNewCourse({
            ...newCourse,
            teacherId: e.target.value,
        });
    };

    const confirmCreateCourse = () => {
        const payload = {
            title: newCourse.title,
            description: newCourse.description,
            teacherId: parseInt(newCourse.teacherId),
        };

        fetch('http://localhost:8080/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to create course");
                return res.json();
            })
            .then(data => {
                setCourses([...courses, data]);
                setNewCourse({ title: '', description: '', teacherId: '' });
                setShowCreateCourseModal(false);
            })
            .catch(err => {
                console.error('Error creating course:', err);
                setShowCreateCourseModal(false);
            });
    };

    const handleCreateCourse = (e) => {
        e.preventDefault();
        setShowCreateCourseModal(true);
    };

    const confirmDeleteCourse = () => {
        if (!courseToDelete) return;

        fetch(`http://localhost:8080/api/courses/${courseToDelete.id}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    setCourses(courses.filter(c => c.id !== courseToDelete.id));
                    setShowDeleteCourseModal(false);
                    setCourseToDelete(null);
                } else {
                    res.text().then(errorMsg => {
                        console.error('Error deleting course:', errorMsg);
                        alert(`Error: ${errorMsg}`);
                    });
                }
            })
            .catch(err => console.error('Error deleting course:', err));
    };

    if (loading) {
        return <div className="text-center">Loading courses...</div>;
    }

    return (
        <div className="admin-course-manager">
            <h2 className="text-center">Course Management</h2>

            <div className="edit-course">
                <h2 className="text-center">Create New Course</h2>
                <form onSubmit={handleCreateCourse}>
                    <label htmlFor="title">Course Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={newCourse.title}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="description">Course Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={newCourse.description}
                        onChange={handleChange}
                        required
                        rows={4}
                    ></textarea>

                    <label htmlFor="teacherId">Teacher</label>
                    <select
                        id="teacherId"
                        name="teacherId"
                        value={newCourse.teacherId}
                        onChange={handleTeacherChange}
                        required
                        className="edit-course"
                    >
                        <option value="">Select a teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.user ? teacher.user.name : "Unknown Teacher"}
                            </option>
                        ))}
                    </select>

                    <button type="submit" className="btn-primary">Create Course</button>
                </form>
            </div>

            <h3 className="course-section">Existing Courses</h3>
            <div className="course-container">
                {courses.map((course) => (
                    <div key={course.id} className="course-card">
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <p><strong>Teacher:</strong> {course.teacher?.user?.name || "No teacher assigned"}</p>
                        <div className="button-container">
                            <button
                                className="btn-primary"
                                onClick={() => navigate(`/courses/${course.id}/edit`)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-danger"
                                onClick={() => {
                                    setCourseToDelete(course);
                                    setShowDeleteCourseModal(true);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showDeleteCourseModal && courseToDelete && (
                <ConfirmModalCourse
                    type="delete"
                    course={courseToDelete}
                    onConfirm={confirmDeleteCourse}
                    onCancel={() => {
                        setShowDeleteCourseModal(false);
                        setCourseToDelete(null);
                    }}
                />
            )}

            {showCreateCourseModal && (
                <ConfirmModalCourse
                    type="create"
                    course={newCourse}
                    onConfirm={confirmCreateCourse}
                    onCancel={() => {
                        setShowCreateCourseModal(false);
                        setNewCourse({ title: '', description: '', teacherId: '' });
                    }}
                />
            )}
        </div>
    );
}

export default CourseManagement;