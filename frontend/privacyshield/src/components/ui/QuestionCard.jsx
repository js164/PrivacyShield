import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import AddOptionDialog from './AddOptionDialog';
import { useDrag, useDrop } from 'react-dnd';
import NewOptionEditor from './NewOptionEditor';
import OptionEditor from './OptionEditor';


const ItemType = 'QUESTION';


const QUESTION_CATEGORIES = {
    'DIA': 'Digital Identity & Authentication',
    'DCC': 'Data Collection & Control',
    'LPS': 'Location & Physical Safety',
    'SRM': 'Social & Reputation Management',
    'ST': 'Surveillance & Tracking',
    'TCT': 'Transparency & Corporate Trust',
    'LAP': 'Legal & Advanced Privacy'
};

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
            scores: {}
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
            <div className="bg-white border border-slate-200 rounded-xl transition-all duration-300">
                <div className="p-4 flex items-start gap-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                    <div className="flex-grow">
                        <p className="font-semibold text-slate-800 ">{question.text}</p>
                        {!isExpanded && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                 <span className="font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">{QUESTION_CATEGORIES[question.category] || 'Uncategorized'}</span>
                                <span className={`font-medium px-2 py-0.5 rounded-full capitalize ${ question.multiChoice ? 'bg-purple-100 text-purple-800 ' : 'bg-green-100 text-green-800 ' }`}>{question.multiChoice ? 'multiple' : 'single'}</span>
                                <span>{question.options.length} options</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(true); }} className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-slate-100  transition"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                        <svg className={`w-5 h-5 text-slate-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
                {isExpanded && (
                    <div className="pb-4 px-6 space-y-3">
                        {question.options.map((option, idx) => <OptionEditor key={option.id} option={option} optionIndex={idx} onUpdate={handleUpdateOption} onDelete={() => setOptionToDelete(option._id)} />)}
                        <button onClick={() => setAddOptionModalOpen(true)} className="w-full mt-2 bg-slate-100 hover:bg-slate-200 0 text-slate-600  font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add Option
                        </button>
                    </div>
                )}
            </div>
            
            <ConfirmationDialog isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={() => { onDelete(question._id); setDeleteModalOpen(false); }} title="Delete Question" message="Are you sure you want to delete this question and all its options? This action cannot be undone." />
            <ConfirmationDialog isOpen={!!optionToDelete} onClose={() => setOptionToDelete(null)} onConfirm={() => handleDeleteOption(optionToDelete)} title="Delete Option" message="Are you sure you want to delete this option?" />
            <AddOptionDialog isOpen={isAddOptionModalOpen} onClose={() => setAddOptionModalOpen(false)} onConfirm={handleAddOption} />
        </>
    );
}
