import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/style.css";

const EditCoursePage = () => {
    const { id } = useParams(); // Получаем ID курса из URL
    const [course, setCourse] = useState(null);
    const [updatedCourse, setUpdatedCourse] = useState({ title: "", description: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`http://localhost:3001/courses/${id}`);
                const data = await res.json();
                setCourse(data);
                setUpdatedCourse({ title: data.title, description: data.description });
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        fetchCourse();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            // Обновляем данные курса на сервере
            await fetch(`http://localhost:3001/courses/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCourse),
            });

            alert("Course updated successfully!");
            navigate("/my-teaching-courses");
        } catch (error) {
            console.error("Error updating course:", error);
            alert("Error updating course.");
        }
    };

    if (!course) return <div>Loading...</div>;

    return (
        <div className="edit-course">
            <h1>Edit Course: {course.title}</h1>

            <div>
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={updatedCourse.title}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Description:</label>
                <textarea
                    name="description"
                    value={updatedCourse.description}
                    onChange={handleChange}
                />
            </div>

            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
};

export default EditCoursePage;