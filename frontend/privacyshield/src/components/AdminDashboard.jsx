import React, { useEffect } from 'react'
import { useCallback } from 'react';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import QuestionCard from './ui/QuestionCard';
import AddQuestionModal from './ui/AddQuestionModal';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import getAllQuestions from './ui/getAllQuestions';
import Navbar from './ui/Navbar';

const CATEGORIES = {
    DC: "Data Collection", LC: "Loss of Control", UDU: "Unauthorized Data Use", ST: "Surveillance & Tracking", DR: "Data Retention", ESH: "Emotional/Social Harm", MIC: "Mistrust in Companies", SB: "Security Breaches", RD: "Reputation Damage", PD: "Physical Danger", DIT: "Digital Identity Theft", SE: "Social Engineering", GLR: "Geo-location Risks", ODU: "Opacity of Data Use", MPOT: "Managing Privacy Over Time", LRPG: "Legal vs. Real Protection Gap", PA: "Purpose Ambiguity", DSTP: "Data Sale to Third Parties", LT: "Lack of Transparency", CD: "Correctness of Data", APS: "Anonymity for Personal Safety", CE: "Criminal Exploitation"
};

const ItemType = 'QUESTION';
const getInitialScores = () => Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});


export default function AdminDashboard() {
    // --- State Management ---
    const [questions, setQuestions] = useState();
    const [isLoading, setIsLoading] = useState(false); // No longer loading from a remote source
    const [error, setError] = useState(null);
    const [isAddQuestionModalOpen, setAddQuestionModalOpen] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const q = await getAllQuestions();
                setQuestions(q);
            } catch (err) {
                setError(err);
            }
        };

        fetchQuestions();
    }, [])

    // --- Local State Handlers ---
    const handleAddQuestion = (questionData) => {

        questionData['questionOrder'] = questions.length + 1
        console.log(questionData);

        axios.post('/question/add', questionData).then(response => {
            console.log(response);
            if (response.status == 200) {

                const newQuestion = {
                    id: response.data.data._id,
                    text: response.data.data.text,
                    order: response.data.data.questionOrder,
                    options: questionData.options.map((opt, index) => ({
                        ...opt,
                        id: `opt_${Date.now()}_${index}`,
                    }))
                }
                setQuestions(prev => [...prev, newQuestion].sort((a, b) => a.order - b.order));

            };

            setAddQuestionModalOpen(false);
        });
    }

    const handleDeleteQuestion = (id) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const handleUpdateQuestion = (id, updatedData) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updatedData } : q));
    };

    const moveQuestion = useCallback((dragIndex, hoverIndex) => {
        setQuestions(prevQuestions => {
            const newQuestions = [...prevQuestions];
            const [draggedItem] = newQuestions.splice(dragIndex, 1);
            newQuestions.splice(hoverIndex, 0, draggedItem);

            return newQuestions.map((q, index) => ({ ...q, order: index }));
        });
    }, []);


    // --- Render Logic ---
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading Dashboard...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-600">
                <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">An Error Occurred</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <Navbar />
            {/* <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
                        <h1 className="text-4xl font-bold text-blue-600">PrivacyShield</h1>
                        <p className="text-lg text-gray-500 mt-1">Admin Dashboard</p>
                    </header> */}

            {/* <div className="mb-8">
                        <button
                            onClick={() => setAddQuestionModalOpen(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add New Question
                        </button>
                    </div>

                    <AddQuestionModal
                        isOpen={isAddQuestionModalOpen}
                        onClose={() => setAddQuestionModalOpen(false)}
                        onConfirm={handleAddQuestion}
                    />

                    <main>
                        {questions && questions.map((question, index) => (
                            <QuestionCard
                                key={question.id}
                                index={index}
                                question={question}
                                onDelete={handleDeleteQuestion}
                                onUpdate={handleUpdateQuestion}
                                moveQuestion={moveQuestion}
                            />
                        ))}
                        {questions && questions.length === 0 && !isLoading && (
                            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                                <p className="text-gray-500">No questions yet. Add one above to get started!</p>
                            </div>
                        )}
                    </main> */}

            <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 p-6 bg-white rounded-xl shadow-md">
                    <h1 className="text-4xl font-display font-bold text-dark-blue">PrivacyShield</h1>
                    <p className="text-lg text-neutral-gray mt-1">Admin Dashboard</p>
                    </header>

                    <div className="mb-8">

                        <button onClick={() => setAddQuestionModalOpen(true)}
                        className="w-full bg-primary-blue hover:bg-dark-blue text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                        ></button>
                    </div>

                    <AddQuestionModal
                        isOpen={isAddQuestionModalOpen}
                        onClose={() => setAddQuestionModalOpen(false)}
                        onConfirm={handleAddQuestion}
                    />

                    <main className="space-y-12">
                        {/* --- Section 1 --- */}
                        <section className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-700">Section 1</h2>
                            </div>
                            <div className="space-y-6">
                                {questions && questions.filter((val, j) => val.section == 1).map((question, index) => (
                                    <QuestionCard key={question._id} index={index} question={question} onDelete={handleDeleteQuestion} onUpdate={handleUpdateQuestion} moveQuestion={(dragIndex, hoverIndex) => moveQuestion(dragIndex, hoverIndex, 1)} />
                                ))}
                                {questions && questions.filter((val, j) => val.section == 1).length === 0 && <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200"><p className="text-gray-500">No questions in this section.</p></div>}
                            </div>
                        </section>

                        {/* --- Section 2 --- */}
                        <section className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-700">Section 2</h2>
                            </div>
                            <div className="space-y-6">
                                {questions && questions.filter((val, j) => val.section == 2).map((question, index) => (
                                    <QuestionCard key={question._id} index={index} question={question} onDelete={handleDeleteQuestion} onUpdate={handleUpdateQuestion} moveQuestion={(dragIndex, hoverIndex) => moveQuestion(dragIndex, hoverIndex, 2)} />
                                ))}
                                {questions && questions.filter((val, j) => val.section == 2).length === 0 && <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200"><p className="text-gray-500">No questions in this section.</p></div>}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </DndProvider>
    );
}
