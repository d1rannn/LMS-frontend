import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import "../style/style.css";
import Navbar from "./Navbar";

const TeacherCoursesPage = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (!user) return;  // Если user еще не загружен, не выполняем запросы

        const fetchTeacherCourses = async () => {
            try {
                // 1. Получаем данные преподавателя
                const teacherRes = await fetch(`http://localhost:3001/teachers?userId=${user.id}`);
                const teacherData = await teacherRes.json();
                const teacher = teacherData[0];

                if (!teacher) return;

                // 2. Загружаем все курсы
                const coursesRes = await fetch(`http://localhost:3001/courses`);
                const allCourses = await coursesRes.json();

                // 3. Фильтруем курсы, которые ведёт преподаватель
                const teacherCourses = allCourses.filter(course =>
                    teacher.teachingCourseIds.includes(String(course.id))
                );

                setCourses(teacherCourses);
            } catch (err) {
                console.error("Error loading teacher courses:", err);
            }
        };

        fetchTeacherCourses();
    }, [user]); // Перезапускаем эффект, если user меняется

    return (
        <div className="teacher-courses">
            <Navbar />
            <div className="text-center">
                <h1>Your Teaching Courses</h1>
            </div>

            {courses.length === 0 ? (
                <p>You are not teaching any courses yet.</p>
            ) : (
                <div className="course-list">
                    {courses.map(course => (
                        <div key={course.id} className="course-card">
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
    );
};

export default TeacherCoursesPage;