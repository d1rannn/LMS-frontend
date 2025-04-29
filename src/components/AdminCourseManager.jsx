import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function AdminCourseManager() {
    const user = useSelector(state => state.auth.user);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch('/courses')
            .then(res => res.json())
            .then(data => setCourses(data));
    }, []);

    if (!user || user.role !== 'admin') {
        return <p>Access denied</p>;
    }

    return (
        <div>
            <h1>Course Manager (Admin)</h1>
            {/* render courses */}
        </div>
    );
}

export default AdminCourseManager;