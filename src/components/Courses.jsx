import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';

function Courses() {
    const user = useSelector(state => state.auth?.user);

    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

    useEffect(() => {
        // fetch all courses
        fetch('http://localhost:8080/api/courses')
            .then(res => res.json())
            .then(setCourses)
            .catch(console.error);

        // once we have a user, fetch their enrolled courses
        if (user && user.id) {
            fetch(`http://localhost:8080/api/students/user/${user.id}`)
                .then(res => {
                    if (res.status === 404) return null;
                    return res.json();
                })
                .then(data => {
                    if (data?.enrolledCourses) {
                        const ids = data.enrolledCourses.map(c => c.id);
                        setEnrolledCourseIds(ids);
                    }
                })
                .catch(console.error);
        }
    }, [user]);

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content">
                <div className="text-center">
                    <h1>Hi, {user?.name || 'Guest'}</h1>
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
                                    <button onClick={() => {/* dispatch enroll action here */}}>
                                        Sign up
                                    </button>
                                ) : (
                                    <>
                                        <p className="already-enrolled">
                                            You are already enrolled
                                        </p>
                                        <button onClick={() => {/* dispatch unsubscribe action here */}}>
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