// ============================================================================
// SUBSCRIPTIONMODAL.JS - Assessment Reminder Subscription Component
// ============================================================================

import axios from 'axios';
import { useState } from 'react';

/**
 * SubscriptionModal Component
 * 
 * Handles user subscriptions for privacy assessment reminders.
 * Allows users to schedule periodic reminders at different intervals
 * and manages the subscription flow with confirmation.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {function} props.onClose - Callback when modal is closed
 */
export default function SubscriptionModal(props) {
    // ========================================================================
    // State Management
    // ========================================================================

    const [modalStep, setModalStep] = useState(1);          // 1: Form, 2: Confirmation
    const [selectedPlan, setSelectedPlan] = useState(null); // Currently selected reminder plan
    const [email, setEmail] = useState('');                 // User's email address
    const [isSubscribing, setIsSubscribing] = useState(false); // Loading state
    const [message, setMessage] = useState('');             // Status/error messages

    // Environment configuration
    const backend_url = import.meta.env.VITE_BACKEND_URI;
    const web_url = import.meta.env.VITE_WEB_URI;

    // ========================================================================
    // Configuration
    // ========================================================================

    /**
     * Available subscription plans for assessment reminders
     * Each plan defines the frequency of reminder emails
     */
    const subscriptionPlans = [
        { key: "monthly", label: "Monthly", months: 1 },
        { key: "3-month", label: "Every 3 Months", months: 3 },
        { key: "6-month", label: "Every 6 Months", months: 6 },
        { key: "yearly", label: "Yearly", months: 12 },
    ];

    // ========================================================================
    // Event Handlers
    // ========================================================================

    /**
     * Handles modal closure and resets all form state
     * Ensures clean state when modal is reopened
     */
    const handleCloseModal = () => {
        setModalStep(1);              // Reset to form step
        setSelectedPlan(null);        // Clear selected plan
        setEmail('');                 // Clear email input
        setMessage('');               // Clear any messages
        setIsSubscribing(false);      // Reset loading state
        props.onClose();              // Call parent's close handler
    };

    /**
     * Handles subscription plan selection
     * @param {Object} plan - The selected subscription plan
     */
    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
    };

    /**
     * Handles subscription form submission
     * Validates input, calculates schedule date, and submits to API
     * @param {Event} e - Form submission event
     */
    const handleSubscriptionSubmit = async (e) => {
        e.preventDefault();

        // ====================================================================
        // Input Validation
        // ====================================================================

        if (!selectedPlan) {
            setMessage('Please select a reminder frequency.');
            return;
        }

        if (!email || !/\S+@\S+\.\S+$/.test(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }

        // ====================================================================
        // API Submission
        // ====================================================================

        setIsSubscribing(true);       // Show loading state
        setMessage('');               // Clear previous messages

        // Calculate the next reminder date based on selected plan
        const scheduleDate = new Date();
        scheduleDate.setMonth(scheduleDate.getMonth() + selectedPlan.months);

        try {
            // Submit subscription request to backend
            const response = await axios.post(
                backend_url + "/assesment/schedule",
                {
                    to: email,                                           // Recipient email
                    subject: "Your Privacy Assessment Reminder",        // Email subject
                    date: scheduleDate.toISOString(),                   // Reminder date
                    assessmentLink: web_url,                            // Link back to assessment
                    frequency: selectedPlan.months                      // Reminder frequency
                }
            );

            // Handle successful subscription
            if (response.status === 200) {
                setMessage(
                    `Success! A confirmation email has been sent to ${email}. ` +
                    `You will receive a reminder to take the assessment ${selectedPlan.label.toLowerCase()}.`
                );
                setIsSubscribing(false);  // Hide loading state
                setModalStep(2);          // Move to confirmation step
            }

        } catch (error) {
            // Handle API errors
            console.error('Subscription error:', error);
            setMessage('An error occurred. Please try again.');
            setIsSubscribing(false);
        }
    };

    // ========================================================================
    // Render Methods
    // ========================================================================

    /**
     * Renders the appropriate modal content based on current step
     * @returns {JSX.Element} - The modal content to display
     */
    const renderModalContent = () => {
        switch (modalStep) {
            case 1:
                // ============================================================
                // Step 1: Subscription Form
                // ============================================================
                return (
                    <form onSubmit={handleSubscriptionSubmit}>
                        {/* Form Header */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Get Reassessment Reminders
                        </h2>
                        <p className="mb-4 text-gray-600">
                            Choose a frequency and enter your email to get notified.
                        </p>

                        {/* Plan Selection Grid */}
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

                        {/* Email Input */}
                        <div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-3 mt-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Error/Status Messages */}
                        {message && (
                            <p className="text-red-500 text-sm text-center mt-3">
                                {message}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full px-6 py-3 mt-4 font-semibold text-white bg-purple-600 rounded-lg cursor-pointer hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
                            disabled={isSubscribing}
                        >
                            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>
                );

            case 2:
                // ============================================================
                // Step 2: Confirmation Message
                // ============================================================
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Thank You!
                        </h2>
                        <p className="my-5 text-center text-gray-800">
                            {message}
                        </p>
                        <button
                            onClick={handleCloseModal}
                            className="w-full px-6 py-3 mt-4 font-semibold text-white bg-purple-600 rounded-lg cursor-pointer hover:bg-purple-700"
                        >
                            Close
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    // ========================================================================
    // Component Render
    // ========================================================================

    return (
        <>
            {props.isOpen && (
                // Modal Backdrop
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={handleCloseModal}
                >
                    {/* Modal Container */}
                    <div
                        className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-lg"
                        onClick={(e) => e.stopPropagation()}  // Prevent backdrop click
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 text-2xl text-gray-500 bg-transparent border-none cursor-pointer hover:text-gray-800"
                            onClick={handleCloseModal}
                        >
                            &times;
                        </button>

                        {/* Dynamic Content */}
                        {renderModalContent()}
                    </div>
                </div>
            )}
        </>
    );
}