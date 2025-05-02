import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import "../style/style.css";

function TeacherCoursesPage() {
    const user = useSelector(state => state?.user);
    const [teachingCourses, setTeachingCourses] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:8080/api/teachers/${user.id}/courses`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch courses');
                    return res.json();
                })
                .then(data => setTeachingCourses(data))
                .catch(err => setError(err.message));
        }
    }, [user]);

    if (!user || user.role.toUpperCase() !== 'TEACHER') {
        return <p>Access denied</p>;
    }

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content">
                <h1 className="text-2xl font-bold text-center mb-4">My Teaching Courses</h1>

                {error && <p className="text-red-500 text-center">{error}</p>}

                {teachingCourses.length === 0 ? (
                    <p className="text-center">You are not teaching any courses yet.</p>
                ) : (
                    <div className="course-grid">
                        {teachingCourses.map(course => (
                            <div key={course.id} className="course-card">
                                <h3 className="text-lg font-semibold">{course.title}</h3>
                                <p className="text-sm text-gray-700">{course.description}</p>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                    >
                                        View Course
                                    </button>
                                </div>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                        onClick={() => navigate(`/edit-course/${course.id}`)}
                                    >
                                        Edit Course
                                    </button>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeacherCoursesPage;