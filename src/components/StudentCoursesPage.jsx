import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../App";
import "../style/style.css";
import Navbar from "./Navbar";

const StudentCoursesPage = () => {
    const { user } = useContext(AuthContext);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchStudentCourses = async () => {
            try {
                // 1. Получаем студента
                const studentRes = await fetch(`http://localhost:3001/students?userId=${user.id}`);
                const studentData = await studentRes.json();
                const student = studentData[0];

                if (student && student.enrolledCourseIds.length > 0) {
                    // 2. Загружаем курсы
                    const coursesRes = await fetch(`http://localhost:3001/courses`);
                    const coursesData = await coursesRes.json();

                    // 3. Загружаем преподавателей и пользователей
                    const [teachersRes, usersRes] = await Promise.all([
                        fetch(`http://localhost:3001/teachers`),
                        fetch(`http://localhost:3001/users`)
                    ]);

                    const teachersData = await teachersRes.json();
                    const usersData = await usersRes.json();

                    setTeachers(teachersData);
                    setUsers(usersData);

                    // 4. Фильтруем курсы, на которые студент записан
                    const enrolled = coursesData.filter(course =>
                        student.enrolledCourseIds.includes(course.id) || student.enrolledCourseIds.includes(Number(course.id))
                    );

                    setEnrolledCourses(enrolled);
                } else {
                    setEnrolledCourses([]);
                }

            } catch (error) {
                console.error("Error loading student courses:", error);
            }
        };

        fetchStudentCourses();
    }, [user.id]);

    // 🔍 Функция для получения имени преподавателя по course.teacherId
    const getTeacherName = (teacherId) => {
        const teacher = teachers.find(t => t.id.toString() === teacherId.toString());
        if (!teacher) return "Unknown Teacher";

        const teacherUser = users.find(u => u.id.toString() === teacher.userId.toString());
        return teacherUser ? teacherUser.name : "Unknown Teacher";
    };

    return (
        <div className="student-courses">
            <div className="text-center">
                <h1>My Enrolled Courses</h1>
            </div>

            <Navbar />

            {enrolledCourses.length === 0 ? (
                <p>You have not enrolled in any courses yet.</p>
            ) : (
                <div className="course-list">
                    {enrolledCourses.map(course => (
                        <div key={course.id} className="course-card">
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            <p><strong>Teacher:</strong> {getTeacherName(course.teacherId)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentCoursesPage;