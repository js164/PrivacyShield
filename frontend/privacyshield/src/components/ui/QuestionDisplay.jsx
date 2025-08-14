import React, { useState } from "react";

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
  isLastQuestion
}) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div
              className="bg-primary-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Question {questionNumber} of {totalQuestions}
          </p>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-6">{questionText}</h2>
          <div className="space-y-4">
            {options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  selected === index
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 bg-white"
                }`}
              >
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
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg text-gray-600 hover:bg-gray-300"
              disabled={questionNumber === 1}
              onClick={onBack}
            >
              Back
            </button>
            <button
              className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-primary-blue disabled:opacity-50"
              disabled={selected === null}
              //onClick={() => onNext(selected)}
              onClick={() => {
      if (isLastQuestion) {
        onFinish(selected);
      } else {
        onNext(selected);
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