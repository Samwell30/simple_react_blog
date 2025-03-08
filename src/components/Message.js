import React from 'react';

function Message({ message }) {
    if (!message) return null;
    return (
        <div className={`message ${message.startsWith('Error') ? 'error' : ''}`}>
            {message}
        </div>
    );
}

export default Message;
