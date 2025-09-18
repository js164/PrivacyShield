import React, { useState, useEffect } from "react";

/**
 * Survey question component that displays a question with options and navigation buttons.
 * 
 * @param {Object} props - The properties passed to the component
 * @param {string} props.title - The title of the survey.
 * @param {number} props.progress - The progress of the survey as a percentage.
 * @param {number} props.questionNumber - The current question number.
 * @param {number} props.totalQuestions - The total number of questions.
 * @param {string} props.questionText - The text of the current question.
 * @param {string[]} props.options - The options for the current question.
 * @param {function} props.onBack - Callback function to go back to the previous question.
 * @param {function} props.onNext - Callback function to go to the next question.
 * @param {function} props.onFinish - Callback function to finish the survey.
 * @param {boolean} props.isLastQuestion - Whether the current question is the last one.
 * @param {number} props.selectedOption - The selected option for the current question.
 */
export default function SurveyQuestion({
  title,
  progress,
  questionNumber,
  totalQuestions,
  questionText,
  options,
  onBack,
  onNext,
  onFinish,
  isLastQuestion,
  selectedOption
}) {

  // State to track the index of the currently selected option
  const [selected, setSelected] = useState(null);

  // Update local state whenever questionNumber or selectedOption changes
  useEffect(() => {

    // Reset the selected option when the question changes
    setSelected(selectedOption ?? null);

  }, [questionNumber, selectedOption]);

  // Render the component's UI
  return (

    // Container for the survey question
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6 animate-fade-in-up">
      <div className="max-w-3xl w-full">

        {/* Header section containing the survey title and progress bar */}
        <div className="mb-6">
          <h1 className="text-xl font-bold">{title}</h1>

          {/* Progress bar container */}
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">

            {/* The actual progress indicator, with width controlled by the 'progress' prop */}
            <div
              className="bg-primary-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Text indicating current question number out of the total */}
          <p className="text-sm text-gray-500 mt-1">
            Question {questionNumber} of {totalQuestions}
          </p>

        </div>

        {/* Main content card for the question and options */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-6">{questionText}</h2>

          {/* Container for the list of answer options. */}
          <div className="space-y-4">
            {/* Map over the 'options' array to render each one. */}
            {options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  selected === index
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 bg-white"
                }`}
              >

                {/* The radio button input. */}
                <input
                  type="radio"
                  name="surveyOption"
                  className="mr-3 accent-purple-600"
                  checked={selected === index}
                  onChange={() => setSelected(index)}
                />
                {option}
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-8">

            {/* Conditionally render the 'Back' button */}
            {questionNumber > 1 ? (
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg text-gray-600 hover:bg-gray-300"
              onClick={onBack} // Call the parent's onBack function when clicked
            >
              Back
            </button>
            ) : (
              <div />
            )}

            {/* The 'Next' or 'Finish' button */}
            <button
              className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-primary-blue disabled:opacity-50"
              disabled={selected === null}
              onClick={() => {
                if (isLastQuestion) {
                  onFinish(selected); // Call onFinish if it's the last question
                } else {
                  onNext(selected); // Otherwise, call onNext
                }
              }}
            >
              {isLastQuestion ? "Finish" : "Next"}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Your responses are anonymous.
        </p>

      </div>
    </div>
  );
}