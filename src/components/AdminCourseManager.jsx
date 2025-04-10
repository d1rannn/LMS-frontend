import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../App";
import Navbar from "./Navbar";
import "../style/style.css";

const AdminCourseManager = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [users, setUsers] = useState([]);
    const [newCourse, setNewCourse] = useState({
        title: "",
        description: "",
        teacherId: ""
    });

    useEffect(() => {
        if (user?.role !== "admin") return;

        const fetchData = async () => {
            try {
                const [coursesRes, teachersRes, usersRes] = await Promise.all([
                    fetch(`http://localhost:3001/courses`),
                    fetch(`http://localhost:3001/teachers`),
                    fetch(`http://localhost:3001/users`)
                ]);

                setCourses(await coursesRes.json());
                setTeachers(await teachersRes.json());
                setUsers(await usersRes.json());
            } catch (err) {
                console.error("Ошибка загрузки:", err);
            }
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        if (courses.length > 0 && teachers.length > 0) {
            syncTeacherCourses();
        }
    }, [courses, teachers]);

    const syncTeacherCourses = async () => {
        const updatedTeachers = [...teachers];

        for (const course of courses) {
            const teacher = updatedTeachers.find(t => Number(t.id) === Number(course.teacherId));
            if (teacher && !teacher.teachingCourseIds.includes(course.id)) {
                teacher.teachingCourseIds = [...new Set([...(teacher.teachingCourseIds || []), course.id])];

                // Обновляем на сервере
                await fetch(`http://localhost:3001/teachers/${teacher.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ teachingCourseIds: teacher.teachingCourseIds })
                });
            }
        }

        // Обновим локально
        setTeachers(updatedTeachers);
    };

    const getTeacherNameById = (teacherId) => {
        const teacher = teachers.find(t => t.id === Number(teacherId));
        const userData = teacher && users.find(u => u.id === teacher.userId);
        return userData ? userData.name : "Unknown";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCourse = async () => {
        if (!newCourse.title || !newCourse.description || !newCourse.teacherId) {
            alert("Please fill in all fields.");
            return;
        }

        // 1. Создаем курс
        const response = await fetch(`http://localhost:3001/courses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...newCourse,
                teacherId: Number(newCourse.teacherId)
            })
        });

        if (response.ok) {
            const added = await response.json();
            setCourses([...courses, added]);
            setNewCourse({ title: "", description: "", teacherId: "" });

            // 2. Обновляем teacher.teachingCourseIds
            const teacher = teachers.find(t => t.id === Number(newCourse.teacherId));
            if (teacher) {
                const updatedIds = [...new Set([...(teacher.teachingCourseIds || []), added.id])];

                await fetch(`http://localhost:3001/teachers/${teacher.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ teachingCourseIds: updatedIds })
                });

                setTeachers(teachers.map(t =>
                    t.id === teacher.id ? { ...t, teachingCourseIds: updatedIds } : t
                ));
            }
        } else {
            alert("Error adding course.");
        }
    };

    const handleDeleteCourse = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        // 1. Удаляем курс
        await fetch(`http://localhost:3001/courses/${id}`, {
            method: "DELETE"
        });

        // 2. Обновляем teacher.teachingCourseIds на сервере
        const teacher = teachers.find(t => (t.teachingCourseIds || []).includes(id));
        if (teacher) {
            const updatedCourses = teacher.teachingCourseIds.filter(cid => cid !== id);
            await fetch(`http://localhost:3001/teachers/${teacher.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teachingCourseIds: updatedCourses })
            });

            // Обновляем локально
            setTeachers(teachers.map(t =>
                t.id === teacher.id ? { ...t, teachingCourseIds: updatedCourses } : t
            ));
        }

        // 3. Обновляем локальный список курсов
        setCourses(courses.filter(c => c.id !== id));
    };

    const handleChangeTeacher = async (courseId, newTeacherId) => {
        const course = courses.find(c => c.id === courseId);
        const oldTeacher = teachers.find(t => t.teachingCourseIds?.includes(courseId));
        const newTeacher = teachers.find(t => t.id === Number(newTeacherId));

        // 1. Обновляем teacherId у курса
        await fetch(`http://localhost:3001/courses/${courseId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teacherId: Number(newTeacherId) })
        });

        // Обновляем курс в локальном состоянии
        setCourses(courses.map(course =>
            course.id === courseId ? { ...course, teacherId: Number(newTeacherId) } : course
        ));

        // 2. Удаляем курс из старого преподавателя
        if (oldTeacher) {
            const updatedOldCourses = oldTeacher.teachingCourseIds.filter(id => id !== courseId);

            await fetch(`http://localhost:3001/teachers/${oldTeacher.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teachingCourseIds: updatedOldCourses })
            });
        }

        // 3. Добавляем курс в нового преподавателя
        if (newTeacher) {
            const updatedNewCourses = [...new Set([...(newTeacher.teachingCourseIds || []), courseId])];

            await fetch(`http://localhost:3001/teachers/${newTeacher.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teachingCourseIds: updatedNewCourses })
            });
        }

        // 4. Обновляем локально teachers
        const updatedTeachers = teachers.map(t => {
            if (t.id === oldTeacher?.id) {
                return {
                    ...t,
                    teachingCourseIds: t.teachingCourseIds.filter(id => id !== courseId)
                };
            }
            if (t.id === newTeacher?.id) {
                return {
                    ...t,
                    teachingCourseIds: [...new Set([...(t.teachingCourseIds || []), courseId])]
                };
            }
            return t;
        });

        setTeachers(updatedTeachers);
    };

    if (user?.role !== "admin") {
        return <p>You do not have permission to view this page.</p>;
    }

    return (
        <div className="admin-course-manager">
            <Navbar />
            <h2>Course Management</h2>

            <div className="course-form">
                <h3>Add New Course</h3>
                <input
                    name="title"
                    placeholder="Course Title"
                    value={newCourse.title}
                    onChange={handleInputChange}
                />
                <textarea
                    name="description"
                    placeholder="Course Description"
                    value={newCourse.description}
                    onChange={handleInputChange}
                />
                <select
                    name="teacherId"
                    value={newCourse.teacherId}
                    onChange={handleInputChange}
                >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => {
                        const teacherUser = users.find(u => u.id === t.userId);
                        return (
                            <option key={t.id} value={t.id}>
                                {teacherUser?.name || "Unnamed"}
                            </option>
                        );
                    })}
                </select>
                <button onClick={handleAddCourse}>Add Course</button>
            </div>

            <hr />

            <h3>All Courses</h3>
            <div className="course-list">
                {courses.map(course => (
                    <div key={course.id} className="course-card">
                        <h4>{course.title}</h4>
                        <p>{course.description}</p>
                        <p>
                            <strong>Teacher:</strong>{" "}
                            {getTeacherNameById(course.teacherId)}
                        </p>
                        <label>Change Teacher:</label>
                        <select
                            value={course.teacherId}
                            onChange={(e) => handleChangeTeacher(course.id, e.target.value)}
                        >
                            {teachers.map(t => {
                                const teacherUser = users.find(u => u.id === t.userId);
                                return (
                                    <option key={t.id} value={t.id}>
                                        {teacherUser?.name || "Unnamed"}
                                    </option>
                                );
                            })}
                        </select>
                        <button onClick={() => handleDeleteCourse(course.id)}>Delete Course</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCourseManager;