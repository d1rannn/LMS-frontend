import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../App';
import "../style/style.css";
import Navbar from "./Navbar";

const Courses = () => {
    const { user } = useContext(AuthContext);  // Получаем пользователя из контекста
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]); // Стейт для записанных курсов

    useEffect(() => {
        // Получение курсов с JSON-сервера
        fetch(`http://localhost:3001/courses`)
            .then((response) => response.json())
            .then((data) => setCourses(data));

        // Проверка, на какие курсы записан пользователь
        fetch(`http://localhost:3001/students?userId=${user.id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    setEnrolledCourseIds(data[0].enrolledCourseIds || []);
                }
            });
    }, [user.id]); // Эффект зависит от user.id, чтобы обновить данные при изменении пользователя

    const handleSignUp = async (courseId) => {
        try {
            // Обновляем роль пользователя на "student"
            await fetch(`http://localhost:3001/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role: "student" })
            });

            // Получаем студента по userId
            const res = await fetch(`http://localhost:3001/students?userId=${user.id}`);
            const students = await res.json();
            const existingStudent = students[0];

            if (existingStudent) {
                // Если курс ещё не записан, добавляем
                if (!existingStudent.enrolledCourseIds.includes(courseId)) {
                    const updatedCourses = [...existingStudent.enrolledCourseIds, courseId];
                    await fetch(`http://localhost:3001/students/${existingStudent.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ enrolledCourseIds: updatedCourses })
                    });
                    setEnrolledCourseIds(updatedCourses); // Обновляем локальный стейт
                }
            } else {
                // Если студента нет — создаём новый
                await fetch(`http://localhost:3001/students`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id,
                        enrolledCourseIds: [courseId]
                    })
                });
                setEnrolledCourseIds([courseId]); // Обновляем локальный стейт
            }

            alert("You have successfully signed up!");

        } catch (error) {
            console.error("Error in signing for course:", error);
            alert("Error occurred. Try again later.");
        }
    };

    const handleUnsubscribe = async (courseId) => {
        try {
            // Получаем студента по userId
            const res = await fetch(`http://localhost:3001/students?userId=${user.id}`);
            const students = await res.json();
            const existingStudent = students[0];

            if (existingStudent) {
                // Убираем курс из списка записанных
                const updatedCourses = existingStudent.enrolledCourseIds.filter((id) => id !== courseId);
                await fetch(`http://localhost:3001/students/${existingStudent.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ enrolledCourseIds: updatedCourses })
                });
                setEnrolledCourseIds(updatedCourses); // Обновляем локальный стейт
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