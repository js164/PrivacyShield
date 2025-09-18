// AddOptionDialog.js
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Modal from '../ui/Modal';

/**
 * AddOptionDialog Component
 * Simple modal dialog for adding new options to existing questions
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal is closed
 * @param {function} onConfirm - Callback when option text is confirmed
 */
export default function AddOptionDialog({ isOpen, onClose, onConfirm }) {
    // State for option text input
    const [text, setText] = useState('');

    /**
     * Handles form submission
     * Validates text input and calls onConfirm if valid
     */
    const handleConfirm = () => {
        if (text.trim()) {
            onConfirm(text.trim());
            setText(''); // Clear input after submission
        }
    };

    // Reset text input when modal opens
    useEffect(() => {
        if (isOpen) setText('');
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                {/* Modal title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Option</h3>

                {/* Text input with Enter key support */}
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleConfirm()} // Submit on Enter
                    placeholder="Enter new option text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />

                {/* Action buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition disabled:bg-gray-500"
                        disabled={!text.trim()} // Disable if no text entered
                    >
                        Add
                    </button>
                </div>
            </div>
        </Modal>
    );
}