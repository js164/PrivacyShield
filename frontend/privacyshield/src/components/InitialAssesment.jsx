/**
 * QuestionPage Component
 *
 * This component renders the initial screening question for the user to answer 
 * as part of the assessment flow. Users can select one or more options, which 
 * are then mapped to their respective categories and passed to the Assessment page.
 *
 * Features:
 * - Displays a question with multiple selectable options.
 * - Tracks user selections using local state.
 * - Highlights selected options visually.
 * - Includes a "Next" button that navigates to the assessment page, passing selected categories as state.
 * - Utilizes a Navbar component.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INITIAL_QUESTION } from "./config/InitialQuestion";
import { Navbar_Questions } from './ui/Navbar';
import { QUESTION_CATEGORIES } from './config/QuestionCategory';

// QuestionPage component renders the initial question for the user to answer
export default function QuestionPage() {
  
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();
  
  // State to track selected options
  const [selected, setSelected] = useState([]);
  
  // State used for Navbar
  const [isChecking, setIsChecking] = useState(true);

  // Extract the question and its options
  const question = INITIAL_QUESTION.text;
  const options = INITIAL_QUESTION.options;

  // Toggle selection of an option (add/remove from 'selected')
  const toggleSelect = (category) => {
    if (selected.includes(category)) {
      setSelected(selected.filter((item) => item !== category)); // If already selected, remove it
    } else {
      setSelected([...selected, category]); // Otherwise, add it
    }
  };

  // Handle "Next" button click
  const handleSubmit = () => {
    if (selected.length > 0) {

      // Map selected options to their categories
      const categories = INITIAL_QUESTION.options.filter(opt => selected.includes(opt.text)).map(opt => opt.category);

      // Navigate to assessment page, passing selected categories as state
      navigate("/assesment", { state: { initial_answers: categories } });

    }
  };

  return (
    <>
      
      {/* Top navigation bar */}
      <Navbar_Questions isChecking={isChecking} />
      
      {/* Main container */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 animate-fade-in-up">

        {/* Question card container with white background and shadow */}
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          
          {/* Question text */}
          <h1 className="text-2xl font-semibold mb-12 text-center">
            {question}
          </h1>

          {/* Options grid */}
          <div className="grid gap-4">

            {/* Map over the options array to render each option */}
            {options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => toggleSelect(opt.text)}
                className={`flex items-center gap-3 cursor-pointer rounded-2xl shadow-md transition transform hover:scale-[1.02] border-2 p-5 text-left font-semibold text-base ${selected.includes(opt.text)
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                  }`}
              >
                
                {/* Checkbox for selection */}
                <input
                  type="checkbox"
                  checked={selected.includes(opt.text)}
                  onChange={() => toggleSelect(opt.text)}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded cursor-pointer"
                  onClick={(e) => e.stopPropagation()} // prevent double toggle
                />
                
                {/* Option text */}
                <span>{opt.text}</span>
                
                {/* Category label */}
                <span
                  className="text-xs font-semibold py-1 px-3 rounded-full bg-blue-100 text-blue-700 ml-auto"
                  title={QUESTION_CATEGORIES[opt.category]}
                >
                  {QUESTION_CATEGORIES[opt.category]}
                </span>
              </div>
            ))}
          </div>

          {/* Next button (disabled until at least one option selected) */}
          <div className="mt-8 flex justify-center">
            <button
              disabled={selected.length === 0}
              onClick={handleSubmit}
              className={`rounded-2xl px-8 py-3 text-lg font-bold shadow-lg transition-all duration-300 ${selected.length > 0
                  ? "bg-blue-400 text-white rounded-lg hover:bg-primary-blue disabled:opacity-50"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
