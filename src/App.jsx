import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from './store';

import Navbar               from "./common/Navbar";
import Register             from "./auth/Register";
import Home                 from "./system/Home";
import Login                from "./auth/Login";
import Courses              from "./courses/Courses";
import StudentCoursesPage   from "./courses/StudentCoursesPage";
import TeacherCoursesPage   from "./courses/TeacherCoursesPage";
import EditCoursePage       from "./courses/EditCoursePage";
import AdminDashboard       from "./dashboard/AdminDashboard";
import CoursePage           from "./courses/CoursePage";
import ModulePage           from "./modules/ModulePage";
import ModuleEditorPage     from "./modules/ModuleEditorPage";
import Profile              from "./user/Profile";
import UpdateName           from "./user/UpdateName";
import ChangePassword       from "./auth/ChangePassword";
import UserManagement       from "./dashboard/UserManagement";
import BannedPage           from "./system/BannedPage";
import CourseManagement     from "./dashboard/CourseManagement";
import TeacherManagement    from "./dashboard/TeacherManagement";
import AddModulePage        from './modules/AddModulePage';

export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/"                     element={<Home />} />
                    <Route path="/login"                element={<Login />} />
                    <Route path="/register"             element={<Register />} />
                    <Route path="/profile/:id"          element={<Profile />} />
                    <Route path="/profile/:id/update-name"     element={<UpdateName />} />
                    <Route path="/profile/:id/change-password" element={<ChangePassword />} />

                    <Route path="/courses"              element={<Courses />} />
                    <Route path="/student/courses"      element={<StudentCoursesPage />} />
                    <Route path="/teacher/courses"      element={<TeacherCoursesPage />} />
                    <Route path="/courses/:id/edit"      element={<EditCoursePage />} />
                    <Route path="/admin"                element={<AdminDashboard />} />
                    <Route path="/courses/:id"          element={<CoursePage />} />
                    <Route path="/courses/:id/modules/:moduleId" element={<ModulePage />} />
                    <Route path="/modules/:moduleId/edit"        element={<ModuleEditorPage />} />
                    <Route path="/banned"                        element={<BannedPage />} />
                    <Route path="admin/users"           element={<UserManagement />} />
                    <Route path="admin/courses"         element={<CourseManagement />} />
                    <Route path="/admin/teachers"       element={<TeacherManagement />} />
                    <Route path="/courses/:id/modules/create" element={<AddModulePage />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}