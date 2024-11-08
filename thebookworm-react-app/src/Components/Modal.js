import React from 'react';
import './Modal.css'
const Modal = ({ show, onClose, message }) => {
    if (!show) {
        return null;
    }

    const messageText = typeof message === 'string' ? message : JSON.stringify(message);


    return (
        <div className="modalOverlay">
            <div className="modal">
                <h2>{messageText.includes('success') ? 'Success' : 'Error'}</h2>
                <p>{messageText}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
