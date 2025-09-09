import React from 'react';
import './Dialog.css';

export default function ContinueModal({ show, onContinue, onStop, message }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        {/*
        <h2>Almost There!</h2>
        <p>{message || "Do you want to continue with the survey to get a detailed Assessment Report?"}</p>
        */}
        <h2>Almost There! Select</h2>
        <span className="modal-message"><strong>Yes:</strong> To keep going to get a more precise and accurate report tailored specifically to you!</span><br />
        <span className="modal-message"><strong>No:</strong> To generate a report now based on your progress so far.</span>
        <div className="modal-buttons mt-8">
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