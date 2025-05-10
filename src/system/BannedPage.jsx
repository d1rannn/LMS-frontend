import React from 'react';
import "../style/style.css";

function BannedPage() {
    return (
        <div className="wrapper">
            <div className="main-content">
                <h1 className="display-4">Access Denied</h1>
                <p className="lead">Your account has been banned. You no longer have access to this platform.</p>
            </div>
        </div>
    );
}

export default BannedPage;