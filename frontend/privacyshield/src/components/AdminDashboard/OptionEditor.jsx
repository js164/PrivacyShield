// OptionEditor.js
import { useState } from 'react';
import { CATEGORIES } from '../config/Categories';

// Suggestion category mapping for display
const SUGGESTION_CATEGORIES = {
    'area_of_concern': 'Area of Concern',
    'strong_practice': 'Strong Practice',
    'room_for_improvement': 'Room for Improvement'
};

/**
 * OptionEditor Component
 * Read-only display of question options with expandable scores view
 * Used in QuestionCard for viewing existing options
 * 
 * @param {object} option - Option data to display
 * @param {number} optionIndex - Index for generating option letter (A, B, C...)
 */
export default function OptionEditor({ option, optionIndex }) {
    // State for toggling score visibility
    const [isScoresVisible, setIsScoresVisible] = useState(false);

    // CSS classes for different suggestion categories
    const suggestionCategoryColor = {
        area_of_concern: 'bg-red-100 text-red-800',
        strong_practice: 'bg-green-100 text-green-800',
        room_for_improvement: 'bg-yellow-100 text-yellow-800'
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200">
            {/* Option header with text and controls */}
            <div className="p-3 flex items-center justify-between">
                <div className="flex-grow flex items-center gap-3">
                    {/* Option letter indicator (A, B, C...) */}
                    <span className="flex-shrink-0 h-6 w-6 bg-slate-200 text-slate-600 text-xs rounded-full flex items-center justify-center font-semibold">
                        {String.fromCharCode(65 + optionIndex)}
                    </span>

                    {/* Option text display */}
                    <span className="w-full bg-transparent p-1 text-slate-700">
                        {option.text}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Toggle scores visibility button */}
                    <button
                        onClick={() => setIsScoresVisible(!isScoresVisible)}
                        className="text-xs text-slate-500 hover:text-slate-800"
                    >
                        {isScoresVisible ? 'Hide Scores' : 'Show Scores'}
                    </button>

                    {/* Delete button (commented out in original) */}
                    {/* <button onClick={onDelete} className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button> */}
                </div>
            </div>

            {/* Optional suggestion display */}
            {option.suggestion && (
                <div className="px-4 pb-3">
                    <div className={`text-xs italic text-slate-500 bg-slate-100 p-2 rounded-md`}>
                        {/* Suggestion category badge */}
                        <span className={`font-bold not-italic px-2 py-0.5 rounded-full text-xs mr-2 ${suggestionCategoryColor[option.suggestion_category]}`}>
                            {SUGGESTION_CATEGORIES[option.suggestion_category]}
                        </span>
                        {/* Suggestion text */}
                        {option.suggestion}
                    </div>
                </div>
            )}

            {/* Collapsible scores section */}
            {isScoresVisible && (option.scores.length > 0 ? (
                <div className="p-4 border-t border-slate-200 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {/* Render each score */}
                    {option.scores.map((value, key) => (
                        <div key={key} className="flex items-center justify-between bg-slate-100 p-2 rounded-md">
                            {/* Score category with tooltip */}
                            <div className="relative group flex items-center gap-1.5">
                                <span className="text-sm font-medium text-slate-600 cursor-pointer">
                                    {value.code}:
                                </span>

                                {/* Info icon */}
                                <span className="text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </span>

                                {/* Tooltip with category description */}
                                <div className="absolute bottom-full left-1/2 z-10 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none">
                                    {CATEGORIES[value.code]}
                                    {/* Tooltip arrow */}
                                    <svg className="absolute text-slate-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                                        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                                    </svg>
                                </div>
                            </div>

                            {/* Score value display */}
                            <span className="font-bold text-indigo-600">
                                {value.score}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                // No scores message
                <div className="p-4 border-t border-slate-200 text-center text-slate-500">
                    There are no scores for this option
                </div>
            ))}
        </div>
    );
}