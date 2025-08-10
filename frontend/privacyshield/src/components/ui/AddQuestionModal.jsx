import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Modal from './Modal';
import NewOptionEditor from './NewOptionEditor';

const CATEGORIES = {
    DC: "Data Collection", LC: "Loss of Control", UDU: "Unauthorized Data Use", ST: "Surveillance & Tracking", DR: "Data Retention", ESH: "Emotional/Social Harm", MIC: "Mistrust in Companies", SB: "Security Breaches", RD: "Reputation Damage", PD: "Physical Danger", DIT: "Digital Identity Theft", SE: "Social Engineering", GLR: "Geo-location Risks", ODU: "Opacity of Data Use", MPOT: "Managing Privacy Over Time", LRPG: "Legal vs. Real Protection Gap", PA: "Purpose Ambiguity", DSTP: "Data Sale to Third Parties", LT: "Lack of Transparency", CD: "Correctness of Data", APS: "Anonymity for Personal Safety", CE: "Criminal Exploitation"
};

const ItemType = 'QUESTION';
const getInitialScores = () => Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

export default function AddQuestionModal({ isOpen, onClose, onConfirm }) {
    const [questionData, setQuestionData] = useState({ text: '', options: [{ text: '', scores: getInitialScores() }] });
    const [error, setError] = useState('');

    useEffect(() => { if (isOpen) { setQuestionData({ text: '', options: [{ text: '', scores: getInitialScores() }] }); setError(''); } }, [isOpen]);

    const handleTextChange = (e) => setQuestionData({ ...questionData, text: e.target.value });
    const handleTypeChange = (e) => setQuestionData({ ...questionData, type: e.target.value });
    const handleSetChange = (e) => setQuestionData({ ...questionData, set: parseInt(e.target.value, 10) });
    const handleOptionChange = (index, updatedOption) => { const newOptions = [...questionData.options]; newOptions[index] = updatedOption; setQuestionData({ ...questionData, options: newOptions }); };
    const handleAddOption = () => setQuestionData({ ...questionData, options: [...questionData.options, { text: '', scores: getInitialScores() }] });
    const handleRemoveOption = (index) => setQuestionData({ ...questionData, options: questionData.options.filter((_, i) => i !== index) });

    function transformQuestionData(questionData) {
        console.log(questionData);
        return {
            text: questionData.text,
            multiChoice: questionData.type == 'multiple',
            section: questionData.set,
            options: questionData.options.map(option => ({
                text: option.text,
                scores: Object.entries(option.scores)
                    .filter(([_, score]) => score !== 0) // Optional: remove zero-score entries
                    .map(([code, score]) => ({ code, score }))
            }))
        };
    }

    const handleConfirm = () => {
        if (!questionData.text.trim()) { setError("Question text cannot be empty."); return; }
        const validOptions = questionData.options.filter(opt => opt.text.trim() !== '');
        if (validOptions.length === 0) { setError("Please add and fill out at least one option."); return; }
        const data = transformQuestionData(questionData)
        console.log(data);
        onConfirm(data);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Add New Question</h3>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                    <label className="text-sm font-bold text-gray-600 mb-2 block">Section</label>
                    <select value={questionData.set} onChange={handleSetChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
                        <option value={1}>Section 1</option>
                        <option value={2}>Section 2</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-600 mb-2 block">Question Type</label>
                    <select value={questionData.type} onChange={handleTypeChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
                        <option value="signle">Single Choice (Radio Buttons)</option>
                        <option value="multiple">Multiple Choice (Checkboxes)</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-600 mb-2 block">Question Text</label>
                    <input type="text" value={questionData.text} onChange={handleTextChange} placeholder="Enter the full question" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-gray-600 mb-2 block">Options</h4>
                    <div className="space-y-4">
                        {questionData.options.map((option, index) => (
                            <NewOptionEditor key={index} index={index} option={option} onOptionChange={handleOptionChange} onRemove={handleRemoveOption} />
                        ))}
                    </div>
                    <button onClick={handleAddOption} className="mt-4 text-sm text-green-600 hover:text-green-800 font-semibold py-2 px-3 rounded-lg hover:bg-gray-100 transition">+ Add Another Option</button>
                </div>
            </div>
            <div className="p-6 border-t border-gray-200 mt-auto bg-gray-50 rounded-b-xl">
                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition">Cancel</button>
                    <button onClick={handleConfirm} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Add Question</button>
                </div>
            </div>
        </Modal>
    );
}
