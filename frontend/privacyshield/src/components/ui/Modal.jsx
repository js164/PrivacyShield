// ============================================================================
// MODAL.JS - Base Modal Component
// ============================================================================

/**
 * Modal Component
 * 
 * A flexible, reusable modal component that provides a backdrop and container
 * for modal content. Supports different sizes and handles click-outside-to-close.
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {React.ReactNode} children - Modal content to display
 * @param {string} size - Modal size ('md', 'lg', 'xl', '2xl'), defaults to 'md'
 */
export default function Modal({ isOpen, onClose, children, size = 'md' }) {
    // Early return if modal is not open
    if (!isOpen) return null;

    // Size configuration mapping
    const sizeClasses = {
        md: 'max-w-md',     // Small modal
        lg: 'max-w-2xl',    // Large modal
        xl: 'max-w-4xl',    // Extra large modal
        '2xl': 'max-w-6xl'  // Extra extra large modal
    };

    return (
        // Modal backdrop - click to close
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}                    // Close modal when backdrop is clicked
        >
            {/* Modal container */}
            <div
                className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4`}
                onClick={(e) => e.stopPropagation()}  // Prevent close when modal content is clicked
            >
                {children}                       {/* Render modal content */}
            </div>
        </div>
    );
}