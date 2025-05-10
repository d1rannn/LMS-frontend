import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import "../style/style.css";
import Navbar from "../common/Navbar";
import {useNavigate} from "react-router-dom";

function StudentCoursesPage() {
    const user = useSelector((state) => state?.user || state?.user);

    const navigate = useNavigate();
    const [myCourses, setMyCourses] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned || user.role === 'BANNED') {
            navigate('/banned');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:8080/api/students/user/${user.id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch courses');
                    return res.json();
                })
                .then(data => {
                    if (data.enrolledCourses) {
                        setMyCourses(data.enrolledCourses);
                    }
                })
                .catch(console.error);
        }
    }, [user]);

    if (!user || user.role !== 'STUDENT') {
        return <p>Access denied</p>;
    }

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content">
                <div className="student-courses-page">
                    <div className="text-center">
                        <h1>My Courses</h1>
                    </div>
                    {myCourses.length === 0 ? (
                        <p>You are not enrolled in any courses yet.</p>
                    ) : (
                        <div className="course-grid">
                            {myCourses.map((course) => (
                                <div key={course.id} className="course-card">
                                    <h3>{course.title}</h3>
                                    <p>{course.description}</p>
                                    <button onClick={() => navigate(`/courses/${course.id}`)}>
                                        Go to Course
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentCoursesPage;