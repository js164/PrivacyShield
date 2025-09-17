import { useRef } from 'react';
import { useState } from 'react';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import { useDrag, useDrop } from 'react-dnd';
import OptionEditor from './OptionEditor';
import { QUESTION_CATEGORIES } from '../config/QuestionCategory';


const ItemType = 'QUESTION';


export default function QuestionCard({ question, index, onDelete, onUpdate, moveQuestion }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    // const [isAddOptionModalOpen, setAddOptionModalOpen] = useState(false);
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

    // eslint-disable-next-line no-unused-vars
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: () => ({ id: question.id, index }),
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    drag(drop(ref));


    const handleDeleteOption = (optionId) => {
        const updatedOptions = question.options.filter(opt => opt.id !== optionId);
        onUpdate(question.id, { options: updatedOptions });
        setOptionToDelete(null);
    };

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
                        {question.options.map((option, idx) => <OptionEditor key={idx} option={option} optionIndex={idx} onDelete={() => setOptionToDelete(option._id)} />)}

                    </div>
                )}
            </div>

            <ConfirmationDialog isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={() => { onDelete(question._id); setDeleteModalOpen(false); }} title="Delete Question" message="Are you sure you want to delete this question and all its options? This action cannot be undone." />
            <ConfirmationDialog isOpen={!!optionToDelete} onClose={() => setOptionToDelete(null)} onConfirm={() => handleDeleteOption(optionToDelete)} title="Delete Option" message="Are you sure you want to delete this option?" />
        </>
    );
}
