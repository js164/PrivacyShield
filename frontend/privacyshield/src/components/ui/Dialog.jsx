import React from 'react';
import './Dialog.css';

/**
 * ContinueModal component - Displays a dialog prompting the user to continue or stop a survey.
 * 
 * @param {Object} props - The component's properties.
 * @param {boolean} props.show - Whether to show the modal dialog. Controls modal visibility (true = visible, false = hidden)
 * @param {function} props.onContinue - Callback function when the user chooses to continue (clicks the "Yes" button).
 * @param {function} props.onStop - Callback function when the user chooses to stop (clicks the "No" button).
 * @param {string} [props.message] - An optional custom message to display.
 * @returns {JSX.Element|null} - Returns the modal component's JSX or null if 'show' is false.
 */
export default function ContinueModal({ show, onContinue, onStop, message }) {
  
  // If 'show' is false, do not render the modal
  if (!show) return null;

  return (
    
    // The modal backdrop that covers the entire screen
    <div className="modal-backdrop">
      
      {/* Modal container for content */}
      <div className="modal-container">

        {/*
        <h2>Almost There!</h2>
        <p>{message || "Do you want to continue with the survey to get a detailed Assessment Report?"}</p>
        */}
        
        {/* Modal title */}
        <h2>Almost There! Select</h2>
        
        {/* Instructions for user choices */}
        <span className="modal-message"><strong>Yes:</strong> To keep going to get a more precise and accurate report tailored specifically to you!</span><br />
        <span className="modal-message"><strong>No:</strong> To generate a report now based on your progress so far.</span>
        
        {/* Action buttons */}
        <div className="modal-buttons mt-8">
          
          {/* "No" button → triggers onStop callback */}
          <button className="btn-stop" onClick={onStop}>
            No
          </button>
          
          {/* "Yes" button → triggers onContinue callback */}
          <button className="btn-continue" onClick={onContinue}>
            Yes
          </button>
        
        </div>
      </div>
    </div>
  );
}