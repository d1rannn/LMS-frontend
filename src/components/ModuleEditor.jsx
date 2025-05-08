import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ModuleEditor({ modules = [], setModules, onEdit, onDeleteConfirm }) {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    // 🔒 Auth and banned check
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.banned || user.role === 'BANNED') {
            navigate('/banned');
        }
    }, [user, navigate]);

    return (
        <div>
            {modules.map((mod, index) => (
                <div key={mod.id || index} className="module-edit-box">
                    <label>Title</label>
                    <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => {
                            const updated = [...modules];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setModules(updated);
                        }}
                    />

                    <label>Content</label>
                    <textarea
                        rows={4}
                        value={mod.content}
                        onChange={(e) => {
                            const updated = [...modules];
                            updated[index] = { ...updated[index], content: e.target.value };
                            setModules(updated);
                        }}
                    />

                    <div className="module-edit-buttons">
                        <button
                            onClick={() => onEdit(mod)}
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Save Module
                        </button>
                        <button
                            onClick={() => onDeleteConfirm(mod)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete Module
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ModuleEditor;