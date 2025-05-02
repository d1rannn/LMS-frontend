function ModuleEditor({ modules, setModules, onEdit, onDeleteConfirm }) {
    return modules.map((mod, index) => (
        <div key={mod.id} className="module-edit-box">
            <label>Title</label>
            <input
                type="text"
                value={mod.title}
                onChange={(e) => {
                    const updated = [...modules];
                    updated[index].title = e.target.value;
                    setModules(updated);
                }}
            />

            <label>Content</label>
            <textarea
                rows={4}
                value={mod.content}
                onChange={(e) => {
                    const updated = [...modules];
                    updated[index].content = e.target.value;
                    setModules(updated);
                }}
            />

            <div className="module-edit-buttons">
                <button
                    onClick={() => onEdit(mod)}
                    className="bg-blue-500 text-white mr-2"
                >
                    Save Module
                </button>
                <button
                    onClick={() => onDeleteConfirm(mod)}
                    className="bg-red-500 text-white"
                >
                    Delete Module
                </button>
            </div>
        </div>
    ));
}

export default ModuleEditor;