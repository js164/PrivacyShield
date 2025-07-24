import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import AddOptionDialog from './AddOptionDialog';
import { useDrag, useDrop } from 'react-dnd';
import NewOptionEditor from './NewOptionEditor';


const ItemType = 'QUESTION';
export default function QuestionCard({ question, index, onDelete, onUpdate, moveQuestion }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isAddOptionModalOpen, setAddOptionModalOpen] = useState(false);
    const [optionToDelete, setOptionToDelete] = useState(null);

    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: ItemType,
        hover(item) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;
            moveQuestion(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: () => ({ id: question.id, index }),
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    drag(drop(ref));

    const handleAddOption = (newOptionText) => {
        const newOption = {
            id: `opt_${Date.now()}`,
            text: newOptionText,
            scores: getInitialScores()
        };
        const updatedOptions = [...question.options, newOption];
        onUpdate(question.id, { options: updatedOptions });
        setAddOptionModalOpen(false);
    };

    const handleUpdateOption = (optionId, updatedOptionData) => {
        const updatedOptions = question.options.map(opt =>
            opt.id === optionId ? { ...opt, ...updatedOptionData } : opt
        );
        onUpdate(question.id, { options: updatedOptions });
    };

    const handleDeleteOption = (optionId) => {
        const updatedOptions = question.options.filter(opt => opt.id !== optionId);
        onUpdate(question.id, { options: updatedOptions });
        setOptionToDelete(null);
    };

    const opacity = isDragging ? 0.4 : 1;

    return (
        <>
            <div ref={ref} style={{ opacity }} className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300">
                <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="flex items-center">
                        <div ref={drag} className="cursor-move p-2 text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9"cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
                        </div>
                        <span className="font-semibold text-lg ml-4 text-gray-900">{question.questionOrder}. {question.text}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm bg-gray-200 text-blue-800 px-3 py-1 rounded-full">{question.options.length} options</span>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(true); }} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                        <svg className={`w-6 h-6 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
                
                {isExpanded && (
                    <div className="p-6 border-t border-gray-200">
                        {question.options.map((option, idx) => (
                            <NewOptionEditor key={option.id} option={option} optionIndex={idx} onUpdate={handleUpdateOption} onDelete={() => setOptionToDelete(option.id)} />
                        ))}
                        <button onClick={() => setAddOptionModalOpen(true)} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">Add Option</button>
                    </div>
                )}
            </div>
            
            <ConfirmationDialog isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={() => { onDelete(question.id); setDeleteModalOpen(false); }} title="Delete Question" message="Are you sure you want to delete this question and all its options? This action cannot be undone." />
            <ConfirmationDialog isOpen={!!optionToDelete} onClose={() => setOptionToDelete(null)} onConfirm={() => handleDeleteOption(optionToDelete)} title="Delete Option" message="Are you sure you want to delete this option?" />
            <AddOptionDialog isOpen={isAddOptionModalOpen} onClose={() => setAddOptionModalOpen(false)} onConfirm={handleAddOption} />
        </>
    );
}
