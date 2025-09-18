// AdminDashboard.js
import { useEffect } from "react";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import QuestionCard from "./QuestionCard";
import AddQuestionModal from "./AddQuestionModal";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import getAllQuestions from "../ui/getAllQuestions";

// Icon imports
import {
  BarChart3,
  MessageCircleQuestionMark,
  Shield
} from "lucide-react";
import StatsCard from "../StatsCard";
import InitialQuestionCard from "./InitialQuestionCard";
import { Navbar } from "../ui/Navbar";
import { CATEGORIES } from "../config/Categories";
import Toast from "../ui/QuestionSuggestion";

// Backend API configuration
const backend_url = import.meta.env.VITE_BACKEND_URI;

/**
 * AdminDashboard Component
 * Main dashboard for managing assessment questions, viewing statistics,
 * and handling question CRUD operations with drag-and-drop functionality
 */
export default function AdminDashboard() {
  // --- State Management ---
  const [questions, setQuestions] = useState(); // All questions data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isAddQuestionModalOpen, setAddQuestionModalOpen] = useState(false); // Modal visibility
  const [showToast, setShowToast] = useState(false); // Toast notification visibility
  const [toastMessage, setToastMessage] = useState(false); // Toast message content

  /**
   * Fetch all questions from API on component mount
   */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = await getAllQuestions();
        setQuestions(q);
        setIsLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    fetchQuestions();
  }, []);

  /**
   * Handles adding a new question via API call
   * @param {object} questionData - Question data from the form
   */
  const handleAddQuestion = async (questionData) => {
    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem("adminToken");

      // Make API call to add question
      const response = await axios.post(
        backend_url + "/question/add",
        questionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle successful response
      if (response.status === 200 || response.status === 201) {
        // Add the returned ID to question data
        questionData["_id"] = response.data.question._id;

        // Update questions list and sort by order
        setQuestions((prev) =>
          [...prev, questionData].sort((a, b) => a.order - b.order)
        );

        // Show success toast
        setToastMessage(response.data.message);
        setShowToast(true);
      }

      // Close the modal
      setAddQuestionModalOpen(false);
    } catch (err) {
      console.error(
        "Error adding question:",
        err.response?.data || err.message
      );
    }
  };

  /**
   * Handles deleting a question by ID
   * @param {string} id - Question ID to delete
   */
  const handleDeleteQuestion = (id) => {
    axios.delete("/question/question/" + id).then((response) => {
      if (response.status == 200) {
        // Remove question from state
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      }
    });
  };

  /**
   * Handles updating question data
   * @param {string} id - Question ID to update
   * @param {object} updatedData - New question data
   */
  const handleUpdateQuestion = (id, updatedData) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updatedData } : q))
    );
  };

  // --- Render Logic ---

  // Loading state render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        {/* Loading spinner */}
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Loading Dashboard...</span>
      </div>
    );
  }

  // Error state render
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-600">
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            An Error Occurred
          </h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Main dashboard render
  return (
    <DndProvider backend={HTML5Backend}>
      <Navbar />

      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <header className="mb-8 flex items-center justify-center text-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-600 ">
                Admin Dashboard
              </h1>
            </div>
          </header>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up mb-8">
            {/* Total Questions Stat */}
            <StatsCard
              icon={MessageCircleQuestionMark}
              title="Total Questions"
              value={questions ? questions.length : 0}
              description="Active assessment questions"
              color="bg-blue-500"
            />

            {/* Privacy Categories Stat */}
            <StatsCard
              icon={BarChart3}
              title="Privacy Categories"
              value={Object.keys(CATEGORIES).length}
              description="Risk assessment areas"
              color="bg-green-500"
            />

            {/* Recommendations Coverage Stat */}
            <StatsCard
              icon={Shield}
              title="Recommendation Covered"
              value={(() => {
                // Calculate unique recommendation codes covered
                const covered = new Set();
                questions &&
                  questions.forEach((q) => {
                    q.options.forEach((opt) => {
                      if (opt.scores) {
                        // eslint-disable-next-line no-unused-vars
                        Object.entries(opt.scores).forEach(([key, value]) => {
                          if (value) {
                            covered.add(value.code);
                          }
                        });
                      }
                    });
                  });
                return covered.size;
              })()}
              description="Personalized recommendations"
              color="bg-orange-500"
            />
          </div>

          {/* Initial Question Display */}
          <InitialQuestionCard />

          {/* Add New Question Button */}
          <div className="my-8">
            <button
              onClick={() => setAddQuestionModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
            >
              {/* Plus icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add New Question
            </button>
          </div>

          {/* Add Question Modal */}
          <AddQuestionModal
            isOpen={isAddQuestionModalOpen}
            onClose={() => setAddQuestionModalOpen(false)}
            onConfirm={handleAddQuestion}
          />

          {/* Questions List Section */}
          <main className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-700">
                Assessment Questions
              </h2>
              <span className="text-sm font-medium bg-blue-100 text-blue-800  px-3 py-1 rounded-full">
                {questions && questions.length} Questions
              </span>
            </div>

            <div className="space-y-4">
              {/* Render question cards */}
              {questions &&
                questions.map((question, index) => (
                  <QuestionCard
                    key={question._id}
                    index={index}
                    question={question}
                    onDelete={handleDeleteQuestion}
                    onUpdate={handleUpdateQuestion}
                  />
                ))}

              {/* Empty state */}
              {questions && questions.length === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-500">
                    No questions yet. Add one above.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        show={showToast}
        duration={2000}
        onClose={() => setShowToast(false)}
      />
    </DndProvider>
  );
}