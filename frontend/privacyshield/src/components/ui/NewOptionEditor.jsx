import React from 'react'
import { useState } from 'react';

const CATEGORIES = {
    DC: "Data Collection", LC: "Loss of Control", UDU: "Unauthorized Data Use", ST: "Surveillance & Tracking", DR: "Data Retention", ESH: "Emotional/Social Harm", MIC: "Mistrust in Companies", SB: "Security Breaches", RD: "Reputation Damage", PD: "Physical Danger", DIT: "Digital Identity Theft", SE: "Social Engineering", GLR: "Geo-location Risks", ODU: "Opacity of Data Use", MPOT: "Managing Privacy Over Time", LRPG: "Legal vs. Real Protection Gap", PA: "Purpose Ambiguity", DSTP: "Data Sale to Third Parties", LT: "Lack of Transparency", CD: "Correctness of Data", APS: "Anonymity for Personal Safety", CE: "Criminal Exploitation"
};


export default function NewOptionEditor({ index, option, onOptionChange, onRemove }) {
    const [isScoresVisible, setIsScoresVisible] = useState(false);
    const handleTextChange = (e) => onOptionChange(index, { ...option, text: e.target.value });
    const handleScoreChange = (category, value) => onOptionChange(index, { ...option, scores: { ...option.scores, [category]: parseInt(value, 10) || 0 } });

    return (
        <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
            <div className="flex items-center gap-3">
                <input type="text" value={option.text} onChange={handleTextChange} placeholder={`Option ${index + 1} Text`} className="flex-grow bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                <button onClick={() => setIsScoresVisible(!isScoresVisible)} className="text-sm text-yellow-600 hover:text-yellow-800 whitespace-nowrap">{isScoresVisible ? 'Hide Scores' : 'Edit Scores'}</button>
                <button onClick={() => onRemove(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-gray-200 rounded-full transition"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
            {isScoresVisible && (
                <div className="mt-4 pt-4 border-t border-gray-300 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {Object.entries(CATEGORIES).map(([key, name]) => (
                        // <div key={key} className="flex items-center justify-between"><label className="text-sm text-gray-600" title={name}>{key}:</label><input type="number" value={option.scores[key] || 0} onChange={(e) => handleScoreChange(key, e.target.value)} className="w-20 bg-white border border-gray-300 rounded-md px-2 py-1 text-center text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-none" /></div>
                        <div key={key} className="flex items-center justify-between">
                            <div className="relative group flex items-center gap-1.5">
                                <label htmlFor={`new-opt-${index}-${key}`} className="text-sm text-gray-600 cursor-pointer">{key}:</label>
                                <span className="text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                </span>
                                <div className="absolute bottom-full left-1/2 z-10 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none">
                                    {name}
                                    <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                                </div>
                            </div>
                            <input id={`new-opt-${index}-${key}`} type="number" value={option.scores[key] || 0} onChange={(e) => handleScoreChange(key, e.target.value)} className="w-20 bg-white border border-gray-300 rounded-md px-2 py-1 text-center text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
