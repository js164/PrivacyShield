import React, { useEffect } from "react";

/**
 * A Toast component that displays a message with a specific color category.
 * 
 * @param {Object} props
 * @param {string} props.message - The message to be displayed in the toast.
 * @param {string} [props.color_category='strong_practice'] - The color category of the toast (strong_practice, room_for_improvement, area_of_concern).
 * @param {boolean} props.show - Boolean to toggle visibility.
 * @param {number} [props.duration=2000] - The duration in milliseconds before the toast closes automatically.
 * @param {function} props.onClose - Callback function to close the toast.
 */
export default function Toast({ message, color_category = "strong_practice", show, duration = 2000, onClose }) {

  // This useEffect hook manages the timer for the toast's visibility
  useEffect(() => {

    // Only set a timer if the 'show' prop is true
    if (show) {

      // Set a timer to auto-close toast after duration
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      // Cleanup function to clear the timer if component unmounts
      return () => clearTimeout(timer);

    }
  }, [show, duration, onClose]); // Dependencies: re-run when these values change

  // Map color category prop to Tailwind classes
  const colorClasses = {
    "strong_practice" : "bg-green-500",        // Green for good practices
    "room_for_improvement" : "bg-yellow-500",  // Yellow for warnings
    "area_of_concern" : "bg-red-500",          // Red for concerns
  };

  return (
    <div
      className={`fixed top-[88px] right-4 z-50 transform transition-all duration-500 ease-in-out
        ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >

      {/* Toast content container with dynamic background color */}
      <div className={`${colorClasses[color_category]} text-white px-3 py-2 rounded-md shadow-lg font-medium text-sm break-words max-w-sm`}>
        {message}
      </div>

    </div>
  );
}
