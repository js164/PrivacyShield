import React from 'react';
import './Dialog.css';

export default function ContinueModal({ show, onContinue, onStop, message }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h2>Almost There!</h2>
        <p>{message || "You're halfway through. Do you want to continue with the survey to get a detailed Assessment Report?"}</p>
        <div className="modal-buttons">
          <button className="btn-stop" onClick={onStop}>
            No
          </button>
          <button className="btn-continue" onClick={onContinue}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}