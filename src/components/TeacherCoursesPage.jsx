import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function TeacherCoursesPage() {
    const user = useSelector(state => state.auth.user);
    const [teachingCourses, setTeachingCourses] = useState([]);

    useEffect(() => {
        if (user) {
            fetch(`/teachers/${user.id}/courses`)
                .then(res => res.json())
                .then(data => setTeachingCourses(data));
        }
    }, [user]);

    if (!user || user.role !== 'teacher') {
        return <p>Access denied</p>;
    }

    return (
        <div>
            <h1>My Teaching Courses</h1>
            {/* render teachingCourses */}
        </div>
    );
}

export default TeacherCoursesPage;