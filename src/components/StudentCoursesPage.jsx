import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function StudentCoursesPage() {
    const user = useSelector(state => state.auth.user);
    const [myCourses, setMyCourses] = useState([]);

    useEffect(() => {
        if (user) {
            fetch(`/students/${user.id}/courses`)
                .then(res => res.json())
                .then(data => setMyCourses(data));
        }
    }, [user]);

    if (!user || user.role !== 'student') {
        return <p>Access denied</p>;
    }

    return (
        <div>
            <h1>My Courses</h1>
            {/* render myCourses */}
        </div>
    );
}

export default StudentCoursesPage;