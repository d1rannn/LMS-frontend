import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Use useDispatch for Redux actions
import Navbar from './Navbar';
import { loginSuccess } from '../store/actions/authActions'; // Import the loginSuccess action
import "../style/style.css";

function Courses() {
    const user = useSelector(state => state?.user);
    const dispatch = useDispatch(); // Initialize useDispatch

    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned) {
            navigate('/banned');
        }
    }, [user, navigate]);

    useEffect(() => {
        // Fetch all courses
        fetch('http://localhost:8080/api/courses')
            .then(res => res.json())
            .then(setCourses)
            .catch(console.error);

        // Fetch enrolled courses
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

                // After successful enrollment, re-fetch the user data to get the updated role
                return fetch(`http://localhost:8080/api/users/${user.id}`);
            })
            .then(res => res.json())
            .then(updatedUser => {
                // Dispatch the updated user data to Redux
                dispatch(loginSuccess(updatedUser));

                // Update localStorage with the updated user data
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Save to localStorage
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
                <div className="text-center">
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
                                {!isEnrolled ? (
                                    <button onClick={() => handleEnroll(course.id)}>
                                        Sign up
                                    </button>
                                ) : (
                                    <>
                                        <p className="already-enrolled">
                                            You are already enrolled
                                        </p>
                                        <button
                                            className="unenrolled"
                                            onClick={() => handleUnsubscribe(course.id)}>
                                            Unsubscribe
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Courses;