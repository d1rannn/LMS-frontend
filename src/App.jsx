import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from './store';

import Navbar               from "./components/Navbar";
import Register             from "./components/Register";
import Home                 from "./components/Home";
import Login                from "./components/Login";
import Courses              from "./components/Courses";
import StudentCoursesPage   from "./components/StudentCoursesPage";
import TeacherCoursesPage   from "./components/TeacherCoursesPage";
import EditCoursePage       from "./components/EditCoursePage";
import AdminDashboard       from "./components/AdminDashboard";
import CoursePage from "./components/CoursePage";
import ModulePage from "./components/ModulePage";
import ModuleEditorPage from "./components/ModuleEditorPage";
import ContactUs from "./components/ContactUs";
import Profile from "./components/Profile";
import UpdateName from "./components/UpdateName";
import ChangePassword from "./components/ChangePassword";
import UserManagement from "./components/UserManagement";
import BannedPage from "./components/BannedPage";
import CourseManagement from "./components/CourseManagement";
import TeacherManagement from "./components/TeacherManagement";

export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/"                     element={<Home />} />
                    <Route path="/login"                element={<Login />} />
                    <Route path="/register"             element={<Register />} />
                    <Route path="/contact-us"           element={<ContactUs />} />
                    <Route path="/profile/:id"          element={<Profile />} />
                    <Route path="/profile/:id/update-name"     element={<UpdateName />} />
                    <Route path="/profile/:id/change-password" element={<ChangePassword />} />

                    <Route path="/courses"              element={<Courses />} />
                    <Route path="/student/courses"      element={<StudentCoursesPage />} />
                    <Route path="/teacher/courses"      element={<TeacherCoursesPage />} />
                    <Route path="/edit-course/:id"      element={<EditCoursePage />} />
                    <Route path="/admin"                element={<AdminDashboard />} />
                    <Route path="/courses/:id"          element={<CoursePage />} />
                    <Route path="/courses/:id/modules/:moduleId" element={<ModulePage />} />
                    <Route path="/modules/:moduleId/edit"        element={<ModuleEditorPage />} />
                    <Route path="/banned"                        element={<BannedPage />} />
                    <Route path="admin/users"           element={<UserManagement />} />
                    <Route path="admin/courses"         element={<CourseManagement />} />
                    <Route path="/admin/teachers"       element={<TeacherManagement />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}