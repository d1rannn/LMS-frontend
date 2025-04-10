import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../App";
import "../style/style.css";
import Navbar from "./Navbar";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (user?.role !== "admin") return;

        const fetchData = async () => {
            try {
                const [studentsRes, usersRes, coursesRes] = await Promise.all([
                    fetch(`http://localhost:3001/students`),
                    fetch(`http://localhost:3001/users`),
                    fetch(`http://localhost:3001/courses`)
                ]);

                const studentsData = await studentsRes.json();
                const usersData = await usersRes.json();
                const coursesData = await coursesRes.json();

                setStudents(studentsData);
                setUsers(usersData);
                setCourses(coursesData);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchData();
    }, [user]);

    const getUserName = (userId) => {
        const u = users.find(u => u.id === userId);
        return u ? u.name : "Unknown";
    };

    const getCourseTitle = (courseId) => {
        if (!courseId) return "Unknown Course";

        const c = courses.find(c => c.id.toString() === courseId.toString());
        return c ? c.title : "Unknown Course";
    };

    const handleAddCourse = async (studentId, courseId) => {
        const student = students.find(s => s.id === studentId);
        if (!student || student.enrolledCourseIds.includes(courseId) || courseId === null) return;

        const updatedCourses = [...student.enrolledCourseIds.filter(id => id !== null), courseId];

        await fetch(`http://localhost:3001/students/${studentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enrolledCourseIds: updatedCourses })
        });

        setStudents(students.map(s =>
            s.id === studentId ? { ...s, enrolledCourseIds: updatedCourses } : s
        ));
    };

    const handleRemoveCourse = async (studentId, courseId) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const updatedCourses = student.enrolledCourseIds.filter(id => id !== courseId);

        await fetch(`http://localhost:3001/students/${studentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enrolledCourseIds: updatedCourses })
        });

        setStudents(students.map(s =>
            s.id === studentId ? { ...s, enrolledCourseIds: updatedCourses } : s
        ));
    };

    if (!user || user.role !== "admin") {
        return <p>You do not have access to this page.</p>;
    }

    return (
        <div className="admin-dashboard">
            <Navbar />
            <h1 className="text-center">Admin Dashboard</h1>
            <div className="student-list">
                {students.map(student => (
                    <div key={student.id} className="student-card">
                        <h3>{getUserName(student.userId)}</h3>
                        <p>Enrolled Courses:</p>
                        <ul>
                            {student.enrolledCourseIds.map(courseId => (
                                <li key={courseId}>
                                    {getCourseTitle(courseId)}
                                    <button
                                        onClick={() => handleRemoveCourse(student.id, courseId)}
                                        className="remove-btn"
                                    >
                                        Unsubscribe
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div>
                            <label>Add Course:</label>
                            <select
                                onChange={(e) =>
                                    handleAddCourse(student.id, Number(e.target.value))
                                }
                                defaultValue=""
                            >
                                <option value="" disabled>Select a course</option>
                                {courses
                                    .filter(c => !student.enrolledCourseIds.includes(c.id))
                                    .map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;