import React, { useEffect } from "react";

export default function Toast({ message, color_category = "strong_practice", show, duration = 2000, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  // Map color category prop to Tailwind classes
  const colorClasses = {
    "strong_practice" : "bg-green-500",
    "room_for_improvement" : "bg-yellow-500",
    "area_of_concern" : "bg-red-500",
  };

  return (
    <div
      className={`fixed top-[88px] right-4 z-50 transform transition-all duration-500 ease-in-out
        ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      <div className={`${colorClasses[color_category]} text-white px-3 py-2 rounded-md shadow-lg font-medium text-sm`}>
        {message}
      </div>
    </div>
  );
}
