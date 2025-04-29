import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import "../style/home.css";
import Navbar from "./Navbar";

const TeacherCoursesPage = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchTeacherCourses = async () => {
            try {
                const teacherRes = await fetch(`http://localhost:3001/teachers?userId=${user.id}`);
                const teacherData = await teacherRes.json();
                const teacher = teacherData[0];

                if (!teacher) return;

                const coursesRes = await fetch(`http://localhost:3001/courses`);
                const allCourses = await coursesRes.json();

                const teacherCourses = allCourses.filter(course =>
                    teacher.teachingCourseIds.includes(String(course.id))
                );

                setCourses(teacherCourses);
            } catch (err) {
                console.error("Error loading teacher courses:", err);
            }
        };

        fetchTeacherCourses();
    }, [user]);

    return (
        <div className="main-content"> {/* Matches the .main-content in CSS */}
            <Navbar />
            <div className="course-section"> {/* Matches the .course-section in CSS */}
                <h1>Your Teaching Courses</h1>
                {courses.length === 0 ? (
                    <p>You are not teaching any courses yet.</p>
                ) : (
                    <div className="course-container"> {/* Matches the .course-container in CSS */}
                        {courses.map(course => (
                            <div key={course.id} className="course-card"> {/* Matches the .course-card in CSS */}
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <Link to={`/edit-course/${course.id}`}>
                                    <button>Edit Course</button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherCoursesPage;