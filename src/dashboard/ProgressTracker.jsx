import React from 'react';
import "../style/style.css";

function ProgressTracker({ progress }) {
    return (
        <div className="progress-tracker mb-6">
            <h2 className="text-lg font-semibold mb-2">Your Progress</h2>
            <div className="progress-bar bg-gray-200 rounded-full w-full h-2.5 mb-2">
                <div
                    className="progress-fill bg-blue-500 h-full rounded-full"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-center text-gray-700">{progress.toFixed(2)}% Completed</p>
        </div>
    );
}

export default ProgressTracker;