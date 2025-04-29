import { useSelector } from 'react-redux';

function AdminDashboard() {
    const user = useSelector(state => state.auth.user);

    if (!user || user.role !== 'admin') {
        return <p>Access denied</p>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>

        // <div className="admin-dashboard">
        //     <Navbar />
        //     <h1 className="text-center">Admin Dashboard</h1>
        //     <div className="student-list">
        //         {students.map(student => (
        //             <div key={student.id} className="student-card">
        //                 <h3>{getUserName(student.userId)}</h3>
        //                 <p>Enrolled Courses:</p>
        //                 <ul>
        //                     {student.enrolledCourseIds.map(courseId => (
        //                         <li key={courseId}>
        //                             {getCourseTitle(courseId)}
        //                             <button
        //                                 onClick={() => handleRemoveCourse(student.id, courseId)}
        //                                 className="remove-btn"
        //                             >
        //                                 Unsubscribe
        //                             </button>
        //                         </li>
        //                     ))}
        //                 </ul>
        //
        //                 <div>
        //                     <label>Add Course:</label>
        //                     <select
        //                         onChange={(e) =>
        //                             handleAddCourse(student.id, Number(e.target.value))
        //                         }
        //                         defaultValue=""
        //                     >
        //                         <option value="" disabled>Select a course</option>
        //                         {courses
        //                             .filter(c => !student.enrolledCourseIds.includes(c.id))
        //                             .map(course => (
        //                                 <option key={course.id} value={course.id}>
        //                                     {course.title}
        //                                 </option>
        //                             ))}
        //                     </select>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>
        // </div>
    );
}

export default AdminDashboard;