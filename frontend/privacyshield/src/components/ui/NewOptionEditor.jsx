import React from 'react'
import { useState } from 'react';

const CATEGORIES = {
    DC: "Data Collection", LC: "Loss of Control", UDU: "Unauthorized Data Use", ST: "Surveillance & Tracking", DR: "Data Retention", ESH: "Emotional/Social Harm", MIC: "Mistrust in Companies", SB: "Security Breaches", RD: "Reputation Damage", PD: "Physical Danger", DIT: "Digital Identity Theft", SE: "Social Engineering", GLR: "Geo-location Risks", ODU: "Opacity of Data Use", MPOT: "Managing Privacy Over Time", LRPG: "Legal vs. Real Protection Gap", PA: "Purpose Ambiguity", DSTP: "Data Sale to Third Parties", LT: "Lack of Transparency", CD: "Correctness of Data", APS: "Anonymity for Personal Safety", CE: "Criminal Exploitation"
};


export default function NewOptionEditor({ optionIndex, option, onOptionChange, onRemove }) {
    const [isScoresVisible, setIsScoresVisible] = useState(false);
    const handleTextChange = (e) => onOptionChange(optionIndex, { ...option, text: e.target.value });
    const handleScoreChange = (category, value) => onOptionChange(optionIndex, { ...option, scores: { ...option.scores, [category]: parseInt(value, 10) || 0 } });

    return (
        <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-3 flex items-center justify-between">
                <div className="flex-grow flex items-center gap-3"><span className="flex-shrink-0 h-6 w-6 bg-slate-200 text-slate-600 text-xs rounded-full flex items-center justify-center font-semibold">{String.fromCharCode(65 + optionIndex)}</span>
                <input type="text" value={option.text} onChange={handleTextChange} placeholder={`Option ${optionIndex + 1} Text`} className="w-full bg-transparent p-1 rounded focus:bg-slate-100 focus:outline-none" /></div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsScoresVisible(!isScoresVisible)} className="text-xs text-slate-500 hover:text-slate-800">Edit Scores</button>
                    <button onClick={onRemove} className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-100 "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                </div>
            </div>
            {isScoresVisible && (
                <div className="p-4 border-t border-slate-200 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {Object.entries(CATEGORIES).map(([key, name]) => (
                        <div key={key} className="flex items-center justify-between">
                            <div className="relative group flex items-center gap-1.5">
                                <label htmlFor={`${option.id}-${key}`} className="text-sm text-slate-600 cursor-pointer">{key}:</label>
                                <span className="text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>
                                <div className="absolute bottom-full left-1/2 z-10 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none">{name}<svg className="absolute text-slate-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg></div>
                            </div>
                            <input id={`${option.id}-${key}`} type="number" value={option.scores[key] || 0} onChange={(e) => handleScoreChange(key, e.target.value)} className="w-20 bg-white border border-slate-300 rounded-md px-2 py-1 text-center text-slate-800  focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
