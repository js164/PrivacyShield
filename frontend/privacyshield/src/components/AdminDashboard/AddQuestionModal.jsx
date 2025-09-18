// AddQuestionModal.js
import { useEffect } from 'react';
import { useState } from 'react';
import Modal from '../ui/Modal';
import NewOptionEditor from './NewOptionEditor';
import { CATEGORIES } from '../config/Categories';
import { QUESTION_CATEGORIES } from '../config/QuestionCategory';

// Constants for component configuration
const ItemType = 'QUESTION';

/**
 * Helper function to initialize category scores
 * Creates an object with all category keys set to 0
 */
const getInitialScores = () => Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

/**
 * AddQuestionModal Component
 * Modal dialog for adding new assessment questions with options and scoring
 * * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal is closed
 * @param {function} onConfirm - Callback when question is confirmed/added
 */
export default function AddQuestionModal({ isOpen, onClose, onConfirm }) {
    // State for managing question data structure
    const [questionData, setQuestionData] = useState({
        text: '',
        category: 'DIA',
        options: [{
            text: '',
            scores: getInitialScores(),
            suggestion: '',
            suggestion_category: 'area_of_concern'
        }]
    });

    // State for form validation errors
    const [error, setError] = useState('');

    // Reset form data when modal opens
    useEffect(() => {
        if (isOpen) {
            setQuestionData({
                text: '',
                category: 'DIA',
                options: [{
                    text: '',
                    scores: getInitialScores(),
                    suggestion: '',
                    suggestion_category: 'area_of_concern'
                }]
            });
            setError('');
        }
    }, [isOpen]);

    // Event handlers for form inputs
    const handleTextChange = (e) => setQuestionData({ ...questionData, text: e.target.value });

    /**
     * Updates a specific option in the options array
     * @param {number} index - Index of the option to update
     * @param {object} updatedOption - New option data
     */
    const handleOptionChange = (index, updatedOption) => {
        const newOptions = [...questionData.options];
        newOptions[index] = updatedOption;
        setQuestionData({ ...questionData, options: newOptions });
    };

    // Adds a new empty option to the question
    const handleAddOption = () => setQuestionData({
        ...questionData,
        options: [...questionData.options, {
            text: '',
            scores: getInitialScores(),
            suggestion: '',
            suggestion_category: 'area_of_concern'
        }]
    });

    // Removes an option at the specified index
    const handleRemoveOption = (index) => setQuestionData({
        ...questionData,
        options: questionData.options.filter((_, i) => i !== index)
    });

    // Updates the question category
    const handleCategoryChange = (e) => setQuestionData({ ...questionData, category: e.target.value });

    /**
     * Transforms question data from form format to API format
     * Converts scores object to array of {code, score} objects
     * @param {object} questionData - Raw form data
     * @returns {object} - Transformed data for API
     */
    function transformQuestionData(questionData) {
        return {
            text: questionData.text,
            category: questionData.category,
            options: questionData.options.map(option => ({
                text: option.text,
                suggestion: option.suggestion,
                suggestion_category: option.suggestion_category,
                scores: Object.entries(option.scores)
                    // Filter out zero scores (optional optimization)
                    // eslint-disable-next-line no-unused-vars
                    .filter(([_, score]) => score !== 0)
                    .map(([code, score]) => ({ code, score }))
            }))
        };
    }

    /**
     * Handles form submission with validation
     * Validates required fields and calls onConfirm with transformed data
     */
    const handleConfirm = () => {
        // Validate question text
        if (!questionData.text.trim()) {
            setError("Question text cannot be empty.");
            return;
        }

        // Validate at least one option exists with content
        const validOptions = questionData.options.filter(opt => opt.text.trim() !== '');
        if (validOptions.length === 0) {
            setError("Please add and fill out at least one option.");
            return;
        }

        // Transform and submit data
        const data = transformQuestionData(questionData)
        onConfirm(data);
    };

    // Determines if the add button should be disabled
    const isAddButtonDisabled = !questionData.text.trim() ||
        !questionData.options.some(opt => opt.text.trim() && opt.suggestion.trim());

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Add New Question</h3>
            </div>

            {/* Modal Content - Added scroll functionality */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-96">
                {/* Question Category Selection */}
                <div>
                    <label className="text-sm font-bold text-slate-600 mb-2 block">Question Category</label>
                    <select
                        value={questionData.category}
                        onChange={handleCategoryChange}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                    >
                        {Object.entries(QUESTION_CATEGORIES).map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                        ))}
                    </select>
                </div>

                {/* Question Text Input */}
                <div>
                    <label className="text-sm font-bold text-gray-600 mb-2 block">Question Text</label>
                    <input
                        type="text"
                        value={questionData.text}
                        onChange={handleTextChange}
                        placeholder="Enter the full question"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                </div>

                {/* Options Management Section */}
                <div>
                    <h4 className="text-lg font-bold text-gray-600 mb-2 block">Options</h4>
                    <div className="space-y-4">
                        {/* Render all option editors */}
                        {questionData.options.map((option, index) => (
                            <NewOptionEditor
                                key={index}
                                index={index}
                                option={option}
                                onOptionChange={handleOptionChange}
                                onRemove={handleRemoveOption}
                            />
                        ))}
                    </div>
                    {/* Add new option button */}
                    <button
                        onClick={handleAddOption}
                        className="mt-4 text-sm text-green-600 hover:text-green-800 font-semibold py-2 px-3 rounded-lg hover:bg-gray-100 transition"
                    >
                        + Add Another Option
                    </button>
                </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 mt-auto bg-gray-50 rounded-b-xl">
                {/* Error Display */}
                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isAddButtonDisabled}
                        className={`px-6 py-2 rounded-lg font-semibold transition text-white ${isAddButtonDisabled
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        Add Question
                    </button>
                </div>
            </div>
        </Modal>
    );
}