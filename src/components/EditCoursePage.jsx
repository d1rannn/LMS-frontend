import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function EditCoursePage() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        fetch(`/courses/${id}`)
            .then(res => res.json())
            .then(data => setCourse(data));
    }, [id]);

    if (!course) return <p>Loading...</p>;

    return (
        <div>
            <h1>Edit {course.title}</h1>
            {/* form to edit course */}
        </div>
    );
}

export default EditCoursePage;