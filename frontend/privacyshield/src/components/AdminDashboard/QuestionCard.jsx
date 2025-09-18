// QuestionCard.js
import { useRef } from 'react';
import { useState } from 'react';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import { useDrag, useDrop } from 'react-dnd';
import OptionEditor from './OptionEditor';
import { QUESTION_CATEGORIES } from '../config/QuestionCategory';

// Constants for drag and drop
const ItemType = 'QUESTION';

/**
 * QuestionCard Component
 * Card display for individual questions with expandable options
 * Supports drag-and-drop reordering and deletion confirmation
 * 
 * @param {object} question - Question data object
 * @param {number} index - Position index for drag-and-drop
 * @param {function} onDelete - Callback when question should be deleted
 * @param {function} onUpdate - Callback when question data should be updated
 * @param {function} moveQuestion - Callback for drag-and-drop reordering
 */
export default function QuestionCard({ question, index, onDelete, onUpdate, moveQuestion }) {
    // Component state
    const [isExpanded, setIsExpanded] = useState(false); // Controls option visibility
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Delete confirmation modal
    const [optionToDelete, setOptionToDelete] = useState(null); // Option pending deletion

    // Reference for drag and drop functionality
    const ref = useRef(null);

    // Drop target configuration for drag-and-drop reordering
    const [, drop] = useDrop({
        accept: ItemType,
        hover(item) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;

            // Move the question and update the item's index
            moveQuestion(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    // Drag source configuration
    // eslint-disable-next-line no-unused-vars
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: () => ({ id: question.id, index }),
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    // Apply drag and drop to the ref
    drag(drop(ref));

    /**
     * Handles deletion of a specific option
     * @param {string} optionId - ID of the option to delete
     */
    const handleDeleteOption = (optionId) => {
        const updatedOptions = question.options.filter(opt => opt.id !== optionId);
        onUpdate(question.id, { options: updatedOptions });
        setOptionToDelete(null);
    };

    return (
        <>
            {/* Main question card */}
            <div className="bg-white border border-slate-200 rounded-xl transition-all duration-300">
                {/* Question header - clickable to expand/collapse */}
                <div
                    className="p-4 flex items-start gap-4 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {/* Question number badge */}
                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                    </div>

                    {/* Question content */}
                    <div className="flex-grow">
                        {/* Question text */}
                        <p className="font-semibold text-slate-800">
                            {question.text}
                        </p>

                        {/* Question metadata (only shown when collapsed) */}
                        {!isExpanded && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                {/* Question category badge */}
                                <span className="font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                                    {QUESTION_CATEGORIES[question.category] || 'Uncategorized'}
                                </span>

                                {/* Options count */}
                                <span>{question.options.length} options</span>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        {/* Delete button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card expansion
                                setDeleteModalOpen(true);
                            }}
                            className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-slate-100 transition"
                        >
                            {/* Trash icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>

                        {/* Expand/collapse icon */}
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
                        {/* Render each option */}
                        {question.options.map((option, idx) =>
                            <OptionEditor
                                key={idx}
                                option={option}
                                optionIndex={idx}
                                onDelete={() => setOptionToDelete(option._id)}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Confirmation dialogs */}

            {/* Delete question confirmation */}
            <ConfirmationDialog
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    onDelete(question._id);
                    setDeleteModalOpen(false);
                }}
                title="Delete Question"
                message="Are you sure you want to delete this question and all its options? This action cannot be undone."
            />

            {/* Delete option confirmation */}
            <ConfirmationDialog
                isOpen={!!optionToDelete}
                onClose={() => setOptionToDelete(null)}
                onConfirm={() => handleDeleteOption(optionToDelete)}
                title="Delete Option"
                message="Are you sure you want to delete this option?"
            />
        </>
    );
}