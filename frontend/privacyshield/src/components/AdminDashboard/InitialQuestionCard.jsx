// InitialQuestionCard.js
import { CircleQuestionMark } from 'lucide-react';
import { useState } from 'react'
import { QUESTION_CATEGORIES } from '../config/QuestionCategory';
import { INITIAL_QUESTION } from '../config/InitialQuestion';

/**
 * InitialQuestionCard Component
 * Displays the initial assessment question in a read-only card format
 * Shows the predefined question that starts the assessment flow
 */
export default function InitialQuestionCard() {
    // State for controlling expansion of options
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
            {/* Card title */}
            <h2 className="text-xl font-bold text-slate-700 mb-4">Initial Assessment Question</h2>

            {/* Question container */}
            <div className="bg-white border border-slate-200 rounded-xl">
                {/* Question header - clickable to expand/collapse */}
                <div
                    className="p-4 flex items-start gap-4 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {/* Question icon */}
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        <CircleQuestionMark />
                    </div>

                    {/* Question text */}
                    <div className="flex-grow min-w-0">
                        <p className="font-semibold text-slate-800 break-words">
                            {INITIAL_QUESTION.text}
                        </p>
                    </div>

                    {/* Expand/collapse arrow */}
                    <div className="flex-shrink-0">
                        <svg
                            className={`w-5 h-5 text-slate-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>

                {/* Expandable options section */}
                {isExpanded && (
                    <div className="pb-4 px-6 space-y-3">
                        {/* Render each initial question option */}
                        {INITIAL_QUESTION.options.map((option, idx) => (
                            <div
                                key={option.id}
                                className="bg-slate-50 rounded-lg border border-slate-200 p-3 flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    {/* Option letter indicator (A, B, C...) */}
                                    <span className="flex-shrink-0 h-6 w-6 bg-slate-200 text-slate-600 text-xs rounded-full flex items-center justify-center font-semibold">
                                        {String.fromCharCode(65 + idx)}
                                    </span>

                                    {/* Option text */}
                                    <p className="ml-3 text-slate-700 text-sm">{option.text}</p>
                                </div>

                                {/* Category badge */}
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                                    {QUESTION_CATEGORIES[option.category]}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}