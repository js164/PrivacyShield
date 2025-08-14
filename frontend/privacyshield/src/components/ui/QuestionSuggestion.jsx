import React, { useEffect } from "react";

export default function Toast({ message, show, duration = 2000, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <div
      className={`fixed top-[88px] right-4 z-50 transform transition-all duration-500 ease-in-out
        ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      <div className="bg-green-500 text-white px-3 py-2 rounded-md shadow-lg font-medium text-xs">
        {message}
      </div>
    </div>
  );
}
