import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../style/style.css"; // Import the CSS file

function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);  // State to hold teachers
    const [loading, setLoading] = useState(true);
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        category: '',
        teacherId: null,  // This will be updated based on the selected teacher
    });
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    // If the user is not an admin, redirect to home page
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/'); // Redirect if not an admin
        }
    }, [user, navigate]);

    // Fetch all courses and teachers
    useEffect(() => {
        // Fetch courses
        fetch('http://localhost:8080/api/courses')
            .then((res) => res.json())
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching courses:', err);
                setLoading(false);
            });

        // Fetch teachers
        fetch('http://localhost:8080/api/teachers')  // Assuming you have an endpoint to fetch teachers
            .then((res) => res.json())
            .then((data) => {
                setTeachers(data);
            })
            .catch((err) => {
                console.error('Error fetching teachers:', err);
            });
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
            teacherId: e.target.value,  // Update teacherId when the selection changes
        });
    };

    const handleCreateCourse = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/api/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCourse),
        })
            .then((res) => res.json())
            .then((data) => {
                setCourses([...courses, data]);
                setNewCourse({
                    title: '',
                    description: '',
                    category: '',
                    teacherId: null,
                });
            })
            .catch((err) => console.error('Error creating course:', err));
    };

    const handleDeleteCourse = (id) => {
        fetch(`http://localhost:8080/api/courses/${id}`, { method: 'DELETE' })
            .then(() => {
                setCourses(courses.filter((course) => course.id !== id));
            })
            .catch((err) => console.error('Error deleting course:', err));
    };

    if (loading) {
        return <div>Loading courses...</div>;
    }

    return (
        <div className="admin-course-manager">
            <h2 className="text-center">Course Management</h2>

            {/* New Course Form */}
            <div className="course-form">
                <form onSubmit={handleCreateCourse}>
                    <label htmlFor="title">Course Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={newCourse.title}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="description">Course Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={newCourse.description}
                        onChange={handleChange}
                        required
                    ></textarea>

                    <label htmlFor="category">Course Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={newCourse.category}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="teacherId">Teacher:</label>
                    <select
                        id="teacherId"
                        name="teacherId"
                        value={newCourse.teacherId}
                        onChange={handleTeacherChange}
                        required
                    >
                        <option value="">Select a teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name} {/* Assuming teacher has a 'name' property */}
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
                        {/* Check if the teacher exists */}
                        <p><strong>Teacher:</strong> {course.teacher ? course.teacher.name : "No teacher assigned"}</p>
                        <div className="button-container">
                            <button className="btn-danger" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseManagement;