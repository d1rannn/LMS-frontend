import React, { useState, useEffect, useContext } from "react";
import CourseList from './CourseList';
import { AuthContext } from '../App';
import "../style/style.css";


// Finish: Add enrollment functionality
const CoursesPage = () => {
    const { user } = useContext(AuthContext);  // Получаем пользователя из контекста
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Получение данных с JSON-сервера
        fetch('http://localhost:3001/courses') // Путь к JSON-серверу
            .then((response) => response.json())
            .then((data) => setCourses(data));
    }, []);

    return (
        <div>
            <h2>Список курсов</h2>
            {user?.role === 'user' ? (  // Проверка, есть ли пользователь и его роль
                <CourseList courses={courses} /> // Показываем список курсов, если роль "user"
            ) : (
                <p>У вас нет доступа к курсам.</p> // Если роль не "user", показываем сообщение
            )}
        </div>
    );
};

export default CoursesPage;