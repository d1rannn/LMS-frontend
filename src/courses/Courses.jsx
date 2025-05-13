import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../common/Navbar';
import { loginSuccess } from '../store/actions/authActions';
import "../style/style.css";
import {useNavigate} from "react-router-dom";

function Courses() {
    const user = useSelector(state => state?.user);
    const dispatch = useDispatch();

    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned) {
            navigate('/banned');
        }
    }, [user, navigate]);

    useEffect(() => {
        fetch('http://localhost:8080/api/courses')
            .then(res => res.json())
            .then(setCourses)
            .catch(console.error);

        if (user && user.id) {
            fetch(`http://localhost:8080/api/students/user/${user.id}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch enrolled courses");
                    return res.json();
                })
                .then(data => {
                    if (data.enrolledCourses) {
                        const ids = data.enrolledCourses.map(c => c.id);
                        setEnrolledCourseIds(ids);
                    }
                })
                .catch(console.error);
        }
    }, [user]);

    const handleEnroll = (courseId) => {
        if (!user || !user.id) return;

        fetch(`http://localhost:8080/api/enrollments/enroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: user.id,
                courseId: courseId,
            }),
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to enroll");
                setEnrolledCourseIds(prev => [...prev, courseId]);

                return fetch(`http://localhost:8080/api/users/${user.id}`);
            })
            .then(res => res.json())
            .then(updatedUser => {
                dispatch(loginSuccess(updatedUser));

                localStorage.setItem('user', JSON.stringify(updatedUser));
            })
            .catch(console.error);
    };

    const handleUnsubscribe = (courseId) => {
        if (!user || !user.id) return;

        fetch(`http://localhost:8080/api/enrollments/unsubscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: user.id,
                courseId: courseId,
            }),
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to unsubscribe");
                setEnrolledCourseIds(prev => prev.filter(id => id !== courseId));
            })
            .catch(console.error);
    };

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content">
                <div className="welcome-card">
                    <h1>Hi, {user?.name}</h1>
                    <h2>Available courses:</h2>
                </div>

                <div className="course-grid">
                    {courses.map(course => {
                        const isEnrolled = enrolledCourseIds.includes(course.id);
                        return (
                            <div key={course.id} className="course-card">
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>

                                {isEnrolled && (
                                    <p className="already-enrolled">You are already enrolled</p>
                                )}

                                <div className="card-button-group">
                                    {!isEnrolled ? (
                                        <button onClick={() => handleEnroll(course.id)}>
                                            Sign up
                                        </button>
                                    ) : (
                                        <button
                                            className="unenrolled"
                                            onClick={() => handleUnsubscribe(course.id)}
                                        >
                                            Unsubscribe
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Courses;