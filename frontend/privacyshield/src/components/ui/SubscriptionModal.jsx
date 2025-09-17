import axios from 'axios';
import { useState } from 'react';

export default function SubscriptionModal(props) {
    const [modalStep, setModalStep] = useState(1); // 1: Form, 2: Confirmation
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [message, setMessage] = useState('');
    const backend_url = import.meta.env.VITE_BACKEND_URI;
    const web_url = import.meta.env.VITE_WEB_URI;

    const subscriptionPlans = [
        { key: "monthly", label: "Monthly", months: 1 },
        { key: "3-month", label: "Every 3 Months", months: 3 },
        { key: "6-month", label: "Every 6 Months", months: 6 },
        { key: "yearly", label: "Yearly", months: 12 },
    ];


    const handleCloseModal = () => {
        setModalStep(1);
        setSelectedPlan(null);
        setEmail('');
        setMessage('');
        setIsSubscribing(false);
        props.onClose()
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
    };

    const handleSubscriptionSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPlan) {
            setMessage('Please select a reminder frequency.');
            return;
        }

        if (!email || !/\S+@\S+\.\S+$/.test(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }

        setIsSubscribing(true);
        setMessage('');


        const scheduleDate = new Date();
        scheduleDate.setMonth(scheduleDate.getMonth() + selectedPlan.months);

        axios.post(
            backend_url + "/assesment/schedule",
            {
                to: email,
                subject: "Your Privacy Assessment Reminder",
                date: scheduleDate.toISOString(),
                assessmentLink: web_url,
                frequency: selectedPlan.months
            }
        ).then(response => {
            if (response.status === 200) {
                setMessage(`Success! A confirmation email has been sent to ${email}. You will receive a reminder to take the assessment ${selectedPlan.label.toLowerCase()}.`);
                setIsSubscribing(false);
                setModalStep(2); // Move to the confirmation step
            }

        });
    };


    const renderModalContent = () => {
        switch (modalStep) {
            case 1:
                return (
                    <form onSubmit={handleSubscriptionSubmit}>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Reassessment Reminders</h2>
                        <p className="mb-4 text-gray-600">
                            Choose a frequency and enter your email to get notified.
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {subscriptionPlans.map(plan => {
                                const isSelected = selectedPlan?.key === plan.key;
                                return (
                                    <button
                                        key={plan.key}
                                        type="button"
                                        onClick={() => handleSelectPlan(plan)}
                                        className={`p-3 border rounded-lg text-center cursor-pointer text-sm font-medium transition ${isSelected
                                            ? 'bg-purple-100 border-purple-600 text-purple-700 font-bold'
                                            : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                                            }`}
                                    >
                                        {plan.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-3 mt-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {message && <p className="text-red-500 text-sm text-center mt-3">{message}</p>}
                        <button type="submit" className="w-full px-6 py-3 mt-4 font-semibold text-white bg-purple-600 rounded-lg cursor-pointer hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed" disabled={isSubscribing}>
                            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>
                );
            case 2:
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
                        <p className="my-5 text-center text-gray-800">{message}</p>
                        <button onClick={handleCloseModal} className="w-full px-6 py-3 mt-4 font-semibold text-white bg-purple-600 rounded-lg cursor-pointer hover:bg-purple-700">Close</button>
                    </div>
                )
            default:
                return null;
        }
    };

    return (
        <>
            {props.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCloseModal}>
                    <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-3 right-3 text-2xl text-gray-500 bg-transparent border-none cursor-pointer hover:text-gray-800" onClick={handleCloseModal}>&times;</button>
                        {renderModalContent()}
                    </div>
                </div>
            )}
        </>

    )
}
