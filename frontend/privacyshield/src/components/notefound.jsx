import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Import this
import { Home, FileX } from "lucide-react";

export default function NoteNotFound() {
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate(); // ⬅️ Hook for navigation

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          navigate("/"); // ⬅️ Works now
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    setIsRedirecting(true);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FileX className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Sorry, the page you're looking for doesn't exist or may have been
            deleted. Please check the URL or return to the home page to browse
            your pages.
          </p>

          {/* Countdown */}
          {!isRedirecting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-700 text-sm">
                Automatically redirecting to home page in{" "}
                <span className="font-bold text-blue-800">{countdown}</span>{" "}
                seconds
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              disabled={isRedirecting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isRedirecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Redirecting...
                </>
              ) : (
                <>
                  <Home className="w-4 h-4" />
                  Go to Home Page
                </>
              )}
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact support or check your URL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
