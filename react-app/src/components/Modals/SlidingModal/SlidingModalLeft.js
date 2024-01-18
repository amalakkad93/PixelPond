import React from 'react';
import './SlidingModalLeft.css';

export default function SlidingModalLeft({ isVisible, onClose, children }) {
  return (
      <div className={`sliding-modal ${isVisible ? 'visible' : ''}`}>
          <div className="sliding-modal-backdrop" onClick={onClose}></div>
          <div className="sliding-modal-content">
              {children}
          </div>
          <button className="close-btn" onClick={onClose}></button>
      </div>
  );
}
