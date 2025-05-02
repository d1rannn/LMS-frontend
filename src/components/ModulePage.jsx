import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function ModulePage() {
    const { moduleId } = useParams(); // Get the moduleId from the URL
    const navigate = useNavigate();
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/api/modules/${moduleId}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load module");
                return res.json();
            })
            .then(data => {
                setModule(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [moduleId]);

    if (loading) return <div className="text-center p-6">Loading module...</div>;
    if (!module) return <div className="text-center p-6 text-red-500">Module not found</div>;

    const handleSaveModule = () => {
        fetch(`http://localhost:8080/api/modules/${moduleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: module.title, content: module.content }),
        })
            .then(res => res.json())
            .then(updatedModule => {
                setModule(updatedModule);
                navigate(-1); // Go back to the previous page after saving
            })
            .catch(err => console.error('Failed to save module', err));
    };

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">{module.title}</h1>

                <label>Module Title</label>
                <input
                    type="text"
                    value={module.title}
                    onChange={(e) => setModule({ ...module, title: e.target.value })}
                />

                <label>Content</label>
                <textarea
                    rows={6}
                    value={module.content}
                    onChange={(e) => setModule({ ...module, content: e.target.value })}
                />

                <button onClick={handleSaveModule} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Save Module
                </button>

                <div className="mt-6">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => navigate(-1)} // Go back to the course page
                    >
                        Back to Course
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModulePage;