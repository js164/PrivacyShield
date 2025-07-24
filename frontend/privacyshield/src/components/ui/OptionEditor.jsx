import React from 'react'
import { useState } from 'react';

export default function OptionEditor({ option, optionIndex, onUpdate, onDelete }) {
    const [localText, setLocalText] = useState(option.text);
    const [localScores, setLocalScores] = useState(option.scores);
    const [isScoresVisible, setIsScoresVisible] = useState(false);

    const handleTextBlur = () => { if (localText !== option.text) onUpdate(option.id, { text: localText }); };
    const handleScoreChange = (category, value) => setLocalScores({ ...localScores, [category]: parseInt(value, 10) || 0 });
    const handleScoreBlur = (category) => { if (localScores[category] !== option.scores[category]) onUpdate(option.id, { scores: localScores }); };

    return (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex-grow flex items-center"><span className="font-bold mr-3 text-blue-600">{String.fromCharCode(65 + optionIndex)})</span><input type="text" value={localText} onChange={e => setLocalText(e.target.value)} onBlur={handleTextBlur} className="w-full bg-transparent p-1 rounded focus:bg-gray-100 focus:outline-none" /></div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsScoresVisible(!isScoresVisible)} className="text-sm text-yellow-600 hover:text-yellow-800">{isScoresVisible ? 'Hide Scores' : 'Edit Scores'}</button>
                    <button onClick={onDelete} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-200"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                </div>
            </div>
            {isScoresVisible && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {Object.entries(CATEGORIES).map(([key, name]) => (
                        <div key={key} className="flex items-center justify-between"><label htmlFor={`${option.id}-${key}`} className="text-sm text-gray-600" title={name}>{key}:</label><input id={`${option.id}-${key}`} type="number" value={localScores[key] || 0} onChange={(e) => handleScoreChange(key, e.target.value)} onBlur={() => handleScoreBlur(key)} className="w-20 bg-white border border-gray-300 rounded-md px-2 py-1 text-center text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-none" /></div>
                    ))}
                </div>
            )}
        </div>
    );
}
