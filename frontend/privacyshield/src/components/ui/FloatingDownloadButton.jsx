import React, { useState } from "react";
import { Download } from "lucide-react";

export function FloatingDownloadButton() {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    // Correct path for files in public folder
    const pdfUrl = "/pdf/CSP_documentation.pdf";

    // Create a temporary link element and trigger download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "CSP_documentation.pdf"; // Keep original filename or customize
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Inline CSS styles */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateX(10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>

      <button
        onClick={handleDownload}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center justify-center
          bg-primary-blue hover:bg-dark-blue
          text-white font-medium
          shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          cursor-pointer
          ${
            isHovered
              ? "rounded-2xl px-6 py-4 min-w-[200px] h-14"
              : "rounded-full w-14 h-14"
          }
        `}
      >
        <Download
          size={isHovered ? 20 : 24}
          className={`${
            isHovered ? "mr-2" : ""
          } transition-all duration-300 flex-shrink-0`}
        />
        {isHovered && (
          <span className="whitespace-nowrap text-sm animate-fade-in">
            Download Information
          </span>
        )}
      </button>
    </>
  );
}
