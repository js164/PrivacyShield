// ============================================================================
// CONFIRMATIONDIALOG.JS - Reusable Confirmation Modal Component
// ============================================================================

import Modal from './Modal'

/**
 * ConfirmationDialog Component
 * 
 * A reusable confirmation dialog that prompts users to confirm or cancel actions.
 * Built on top of the Modal component for consistent styling and behavior.
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal is closed/cancelled
 * @param {function} onConfirm - Callback when user confirms action
 * @param {string} title - Dialog title text
 * @param {string} message - Dialog message/description text
 */
export default function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                {/* Dialog Header */}
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    {title}
                </h2>

                {/* Dialog Message */}
                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                    {/* Cancel Button */}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>

                    {/* Confirm Button */}
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    )
}