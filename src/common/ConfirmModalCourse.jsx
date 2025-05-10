function ConfirmModalCourse({ type, course, onConfirm, onCancel }) {
    if (!course) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3 className="text-lg font-semibold mb-2">
                    {type === 'delete'
                        ? 'Delete Course'
                        : type === 'create'
                            ? 'Create Course'
                            : 'Save Course'}
                </h3>
                <p className="mb-4">
                    Are you sure you want to {type} <strong>{course.title}</strong>?
                </p>
                <div className="modal-button-group">
                    <button
                        onClick={onConfirm}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModalCourse;