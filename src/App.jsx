import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Register             from "./components/Register";
import Home                 from "./components/Home";
import Login                from "./components/Login";
import Courses              from "./components/Courses";
import StudentCoursesPage   from "./components/StudentCoursesPage";
import TeacherCoursesPage   from "./components/TeacherCoursesPage";
import EditCoursePage       from "./components/EditCoursePage";
import AdminDashboard       from "./components/AdminDashboard";
import AdminCourseManager   from "./components/AdminCourseManager";

export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/"                     element={<Home />} />
                    <Route path="/login"                element={<Login />} />
                    <Route path="/register"             element={<Register />} />
                    <Route path="/courses"              element={<Courses />} />
                    <Route path="/my-courses"           element={<StudentCoursesPage />} />
                    <Route path="/my-teaching-courses"  element={<TeacherCoursesPage />} />
                    <Route path="/edit-course/:id"      element={<EditCoursePage />} />
                    <Route path="/admin"                element={<AdminDashboard />} />
                    <Route path="/admin-course-manager" element={<AdminCourseManager />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}