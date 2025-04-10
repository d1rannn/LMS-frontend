import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../App';
import "../style/style.css";
import Navbar from "./Navbar";

const Courses = () => {
    const { user, login } = useContext(AuthContext); // login нужен для обновления роли
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

    useEffect(() => {
        // Загружаем список всех курсов
        fetch(`http://localhost:3001/courses`)
            .then((response) => response.json())
            .then((data) => setCourses(data));

        // Загружаем курсы, на которые записан текущий пользователь
        fetch(`http://localhost:3001/students?userId=${user.id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    setEnrolledCourseIds(data[0].enrolledCourseIds || []);
                }
            });
    }, [user.id]);

    const handleSignUp = async (courseId) => {
        try {
            // 1. Обновляем роль в базе
            await fetch(`http://localhost:3001/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role: "student" })
            });

            // 2. Получаем обновлённого пользователя и сохраняем в контекст
            const updatedUserRes = await fetch(`http://localhost:3001/users/${user.id}`);
            const updatedUser = await updatedUserRes.json();
            login(updatedUser); // теперь контекст = student

            // 3. Обновляем таблицу students
            const res = await fetch(`http://localhost:3001/students?userId=${user.id}`);
            const students = await res.json();
            const existingStudent = students[0];

            if (existingStudent) {
                if (!existingStudent.enrolledCourseIds.includes(courseId)) {
                    const updatedCourses = [...existingStudent.enrolledCourseIds, courseId];
                    await fetch(`http://localhost:3001/students/${existingStudent.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ enrolledCourseIds: updatedCourses })
                    });
                    setEnrolledCourseIds(updatedCourses);
                }
            } else {
                await fetch(`http://localhost:3001/students`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id,
                        enrolledCourseIds: [courseId]
                    })
                });
                setEnrolledCourseIds([courseId]);
            }

            alert("You have successfully signed up!");

        } catch (error) {
            console.error("Error in signing for course:", error);
            alert("Error occurred. Try again later.");
        }
    };

    const handleUnsubscribe = async (courseId) => {
        try {
            const res = await fetch(`http://localhost:3001/students?userId=${user.id}`);
            const students = await res.json();
            const existingStudent = students[0];

            if (existingStudent) {
                const updatedCourses = existingStudent.enrolledCourseIds.filter((id) => id !== courseId);
                await fetch(`http://localhost:3001/students/${existingStudent.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ enrolledCourseIds: updatedCourses })
                });
                setEnrolledCourseIds(updatedCourses);
            }

            alert("You have successfully unsubscribed from the course!");

        } catch (error) {
            console.error("Error in unsubscribing from course:", error);
            alert("Error occurred. Try again later.");
        }
    };

    return (
        <div>
            <div className="text-center">
                <h1>Hi, {user.name}</h1>
                <h2>Here are available list of courses you can sign up for</h2>
            </div>
            <Navbar />
            <div className="course-list">
                {courses.map((course) => {
                    const isEnrolled = enrolledCourseIds.includes(course.id);

                    return (
                        <div key={course.id} className="course-card">
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            {!isEnrolled ? (
                                <button onClick={() => handleSignUp(course.id)}>Sign up</button>
                            ) : (
                                <>
                                    <p className="already-enrolled">You are already enrolled</p>
                                    <button onClick={() => handleUnsubscribe(course.id)}>Unsubscribe</button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Courses;