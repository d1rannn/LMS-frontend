import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function StudentCoursesPage() {
    const user = useSelector(state => state.user);
    const [myCourses, setMyCourses] = useState([]);

    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:8080/api/students/user/${user.id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch courses');
                    return res.json();
                })
                .then(data => {
                    if (data.enrolledCourses) {
                        setMyCourses(data.enrolledCourses);
                    }
                })
                .catch(console.error);
        }
    }, [user]);

    if (!user || user.role !== 'STUDENT') {
        return <p>Access denied</p>;
    }

    return (
        <div className="student-courses-page">
            <h1>My Courses</h1>
            {myCourses.length === 0 ? (
                <p>You are not enrolled in any courses yet.</p>
            ) : (
                <ul>
                    {myCourses.map(course => (
                        <li key={course.id}>
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default StudentCoursesPage;