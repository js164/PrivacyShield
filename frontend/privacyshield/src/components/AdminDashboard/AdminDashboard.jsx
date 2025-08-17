import React, { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import QuestionCard from "./QuestionCard";
import AddQuestionModal from "./AddQuestionModal";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import getAllQuestions from "../ui/getAllQuestions";

import {
  BarChart3,
  MessageCircleQuestionMark,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import StatsCard from "../StatsCard";
import InitialQuestionCard from "./InitialQuestionCard";
import { Navbar } from "../ui/Navbar";
import logo from "../../public/Images/logo.png";
import { CATEGORIES } from "../config/Categories";
import Toast from "../ui/QuestionSuggestion";

export default function AdminDashboard() {
  // --- State Management ---
  const [questions, setQuestions] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddQuestionModalOpen, setAddQuestionModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(false);

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

  // const handleAddQuestion = (questionData) => {
  //     console.log(questionData);
  //     axios.post('/question/add', questionData).then(response => {
  //         console.log(response);
  //         if (response.status == 200 || response.status == 201) {
  //             console.log("successsss");
  //             questionData["_id"] = response.data.question._id
  //             setQuestions(prev => [...prev, questionData].sort((a, b) => a.order - b.order));
  //             setToastMessage(response.data.message)
  //             setShowToast(true)
  //         };
  //         setAddQuestionModalOpen(false);
  //     });
  // }

  const handleAddQuestion = async (questionData) => {
    try {
      const token = localStorage.getItem("adminToken"); // or from context if you stored it elsewhere

      const response = await axios.post(
        "http://localhost:8000/question/add",
        questionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // attach token here
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Success!");
        questionData["_id"] = response.data.question._id;
        setQuestions((prev) =>
          [...prev, questionData].sort((a, b) => a.order - b.order)
        );
        setToastMessage(response.data.message);
        setShowToast(true);
      }
      setAddQuestionModalOpen(false);
    } catch (err) {
      console.error(
        "Error adding question:",
        err.response?.data || err.message
      );
    }
  };

  const handleDeleteQuestion = (id) => {
    axios.delete("/question/question/" + id).then((response) => {
      console.log(response);
      if (response.status == 200) {
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      }
    });
  };

  const handleUpdateQuestion = (id, updatedData) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updatedData } : q))
    );
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
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

  return (
    <DndProvider backend={HTML5Backend}>
      <Navbar />

      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex items-center justify-center text-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-600 ">
                Admin Dashboard
              </h1>
            </div>
          </header>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up mb-8">
            <StatsCard
              icon={MessageCircleQuestionMark}
              title="Total Questions"
              value={questions ? questions.length : 0}
              description="Active assessment questions"
              color="bg-blue-500"
            />
            <StatsCard
              icon={BarChart3}
              title="Privacy Categories"
              value={Object.keys(CATEGORIES).length}
              description="Risk assessment areas"
              color="bg-green-500"
            />
            <StatsCard
              icon={Shield}
              title="Recommendation Covered"
              value={(() => {
                const covered = new Set();
                questions &&
                  questions.forEach((q) => {
                    q.options.forEach((opt) => {
                      if (opt.scores) {
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

          <InitialQuestionCard />

          <div className="my-8">
            <button
              onClick={() => setAddQuestionModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
            >
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

          <AddQuestionModal
            isOpen={isAddQuestionModalOpen}
            onClose={() => setAddQuestionModalOpen(false)}
            onConfirm={handleAddQuestion}
          />

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
      <Toast
        message={toastMessage}
        show={showToast}
        duration={2000}
        onClose={() => setShowToast(false)}
      />
    </DndProvider>
  );
}
