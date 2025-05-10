function ConfirmModalAdmin({ type, user, onConfirm, onCancel }) {
    if (!user) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3 className="text-lg font-semibold mb-2">
                    {type === 'ban' ? 'Ban User' : 'Unban User'}
                </h3>
                <p className="mb-4">
                    Are you sure you want to {type} <strong>{user.name}</strong>?
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

export default ConfirmModalAdmin;