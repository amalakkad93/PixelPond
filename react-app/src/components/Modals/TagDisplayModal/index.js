// Modal.js
import React from 'react';
import ReactDOM from 'react-dom';
import './TagDisplayModal.css'

const TagDisplayModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
return ReactDOM.createPortal(
  <div className="tag-modal-overlay">
    <div className="tag-modal-content">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  </div>,
  document.body
);
};

export default TagDisplayModal;
