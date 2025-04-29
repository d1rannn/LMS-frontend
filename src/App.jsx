import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './components/Register';
import Home from './components/Home';
import Login from './components/Login';
import Courses from './components/Courses';
import StudentCoursesPage from './components/StudentCoursesPage';
import TeacherCoursesPage from "./components/TeacherCoursesPage";
import EditCoursePage from "./components/EditCoursePage";
import AdminDashboard from "./components/AdminDashboard";
import AdminCourseManager from "./components/AdminCourseManager";

export const AuthContext = createContext();

export default function App() {
    const [user, setUser] = useState(null);

    function login(userData) {
        setUser(userData);
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/my-courses" element={<StudentCoursesPage />} />
                    <Route path="/my-teaching-courses" element={<TeacherCoursesPage />} />
                    <Route path="/edit-course/:id" element={<EditCoursePage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin-course-manager" element={<AdminCourseManager />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}