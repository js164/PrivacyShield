// NewOptionEditor.js
import { useState } from 'react';
import { CATEGORIES } from '../config/Categories';

// Suggestion category mapping for display
const SUGGESTION_CATEGORIES = {
    'area_of_concern': 'Area of Concern',
    'strong_practice': 'Strong Practice',
    'room_for_improvement': 'Room for Improvement'
};

/**
 * NewOptionEditor Component
 * Editor for creating/editing question options with scoring and suggestions
 * 
 * @param {number} index - Index of this option in the parent's options array
 * @param {object} option - Option data object
 * @param {function} onOptionChange - Callback when option data changes
 * @param {function} onRemove - Callback when option should be removed
 */
export default function NewOptionEditor({ index, option, onOptionChange, onRemove }) {
    // State for toggling score visibility
    const [isScoresVisible, setIsScoresVisible] = useState(false);

    // Event handlers for form inputs
    const handleTextChange = (e) => onOptionChange(index, { ...option, text: e.target.value });
    const handleSuggestionChange = (e) => onOptionChange(index, { ...option, suggestion: e.target.value });
    const handleSuggestionCategoryChange = (e) => onOptionChange(index, { ...option, suggestion_category: e.target.value });

    /**
     * Updates score for a specific category
     * @param {string} category - Category key to update
     * @param {string} value - New score value (will be parsed to int)
     */
    const handleScoreChange = (category, value) => onOptionChange(index, {
        ...option,
        scores: {
            ...option.scores,
            [category]: parseInt(value, 10) || 0
        }
    });

    return (
        <div className="p-4 bg-slate-100 rounded-lg border border-slate-300">
            {/* Main option controls row */}
            <div className="flex items-center gap-3">
                {/* Option text input */}
                <input
                    type="text"
                    value={option.text}
                    onChange={handleTextChange}
                    placeholder={`Option ${index + 1} Text`}
                    className="flex-grow bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />

                {/* Toggle scores visibility button */}
                <button
                    onClick={() => setIsScoresVisible(!isScoresVisible)}
                    className="text-sm text-yellow-600 hover:text-yellow-800 whitespace-nowrap"
                >
                    {isScoresVisible ? 'Hide Scores' : 'Edit Scores'}
                </button>

                {/* Remove option button */}
                <button
                    onClick={() => onRemove(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-slate-200 rounded-full transition"
                >
                    {/* X icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Suggestion inputs row */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Suggestion text input */}
                <input
                    type="text"
                    value={option.suggestion}
                    onChange={handleSuggestionChange}
                    placeholder="Suggestion (optional)"
                    className="sm:col-span-2 w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />

                {/* Suggestion category dropdown */}
                <select
                    value={option.suggestion_category}
                    onChange={handleSuggestionCategoryChange}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                >
                    {Object.entries(SUGGESTION_CATEGORIES).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                    ))}
                </select>
            </div>

            {/* Collapsible scores section */}
            {isScoresVisible && (
                <div className="mt-4 pt-4 border-t border-slate-300 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {/* Render score input for each category */}
                    {Object.entries(CATEGORIES).map(([key, name]) => (
                        <div key={key} className="flex items-center justify-between">
                            {/* Category label with tooltip */}
                            <div className="relative group flex items-center gap-1.5">
                                <label
                                    htmlFor={`new-opt-${index}-${key}`}
                                    className="text-sm text-slate-600 cursor-pointer"
                                >
                                    {key}:
                                </label>

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
                                    {name}
                                    {/* Tooltip arrow */}
                                    <svg className="absolute text-slate-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                                        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                                    </svg>
                                </div>
                            </div>

                            {/* Score input */}
                            <input
                                id={`new-opt-${index}-${key}`}
                                type="number"
                                value={option.scores[key] || 0}
                                onChange={(e) => handleScoreChange(key, e.target.value)}
                                className="w-20 bg-white border border-slate-300 rounded-md px-2 py-1 text-center text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}