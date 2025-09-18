import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SurveyQuestion from "./ui/QuestionDisplay";
import { Navbar_Questions } from './ui/Navbar';
import Toast from "./ui/QuestionSuggestion";
import ContinueModal from './ui/AssesmentContinueDialog';
const backend_url = import.meta.env.VITE_BACKEND_URI;

// Initial Survey Length
const INITIAL_SURVEY_LENGTH = 10;

// Global scores object initialized with 0
export const privacyScores = {
  scores: {
    DC: 0, LC: 0, UDU: 0, ST: 0, DR: 0, ESH: 0, MIC: 0, SB: 0, RD: 0,
    PD: 0, DIT: 0, SE: 0, GLR: 0, ODU: 0, MPOT: 0, LRPG: 0, PA: 0,
    DSTP: 0, LT: 0, CD: 0, APS: 0, CE: 0
  },
  maxScores: {
    DC: 0, LC: 0, UDU: 0, ST: 0, DR: 0, ESH: 0, MIC: 0, SB: 0, RD: 0,
    PD: 0, DIT: 0, SE: 0, GLR: 0, ODU: 0, MPOT: 0, LRPG: 0, PA: 0,
    DSTP: 0, LT: 0, CD: 0, APS: 0, CE: 0
  }
};

// Function to reset privacy scores
const initPrivacyScores = () => ({
  scores: {
    DC: 0, LC: 0, UDU: 0, ST: 0, DR: 0, ESH: 0, MIC: 0, SB: 0, RD: 0,
    PD: 0, DIT: 0, SE: 0, GLR: 0, ODU: 0, MPOT: 0, LRPG: 0, PA: 0,
    DSTP: 0, LT: 0, CD: 0, APS: 0, CE: 0
  },
  maxScores: {
    DC: 0, LC: 0, UDU: 0, ST: 0, DR: 0, ESH: 0, MIC: 0, SB: 0, RD: 0,
    PD: 0, DIT: 0, SE: 0, GLR: 0, ODU: 0, MPOT: 0, LRPG: 0, PA: 0,
    DSTP: 0, LT: 0, CD: 0, APS: 0, CE: 0
  }
});

// Function to sort questions based on initial question's answer and selected categories
function sortData(data, initial_answers) {
  const seen = new Set();
  const first = [];
  const rest = [];

  // Pick first object per unique category
  data.forEach(obj => {
    if (!seen.has(obj.category)) {
      seen.add(obj.category);
      first.push(obj);
    } else {
      rest.push(obj);
    }
  });

  // Split remaining into selected & not selected
  const selected = rest.filter(obj => initial_answers.includes(obj.category));
  const randomised_selected = [...selected].sort(() => Math.random() - 0.5);
  const notSelected = rest.filter(obj => !initial_answers.includes(obj.category));
  const randomised_notSelected = [...notSelected].sort(() => Math.random() - 0.5);

  // concat in required order
  return [...first, ...randomised_selected, ...randomised_notSelected];
};

// Main Assessment component
export default function Assesment() {

  // Reset privacy scores when component mounts
  useEffect(() => {
    // reset on component mount
    Object.assign(privacyScores, initPrivacyScores());
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial answers from navigation state or use empty array as fallback
  const { initial_answers } = location.state || { initial_answers: [] }; // fallback if no state

  // Redirect if user opens /assesment directly or has no answers
  useEffect(() => {
    if (!initial_answers || initial_answers.length === 0) {
      navigate("/initialassesment", { replace: true });
    }
  }, [initial_answers, navigate]);

  // State management
  const [api_data, setAPIData] = useState([]); // raw data from API
  const [questions, setQuestions] = useState([]); // current question text
  const [currentQuestion, setCurrentQuestion] = useState(0); // current question index
  const [answers, setAnswers] = useState([]); // stores user answers
  const [options, setOptions] = useState([]); // options for current question
  const [suggestions, setSuggestions] = useState([]); // suggestions for each option
  const [user_selected_option, setSelectedOption] = useState([]); // currently selected option
  const [loading, setLoading] = useState(true); // loading state
  const [showToast, setShowToast] = useState(false); // Toast visibility
  const [showModal, setShowModal] = useState(true); // Modal visibility
  const [isChecking, setIsChecking] = useState(true); // Checking/loading state for UI
  const [continueSurvey, setContinueSurvey] = useState(false); // full vs partial survey

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {

        // Fetch questions from backend API
        const res = await fetch(backend_url + "/question/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const fetched_data = await res.json();

        // Randomize and then sort the data based on initial user preferences
        const randomised_data = [...fetched_data].sort(() => Math.random() - 0.5);
        const data = sortData(randomised_data, initial_answers);

        // Store the sorted data
        setAPIData(data)

        // Set up the first question
        setQuestions(data[currentQuestion].text);

        // Set up options for the first question
        const newOptions = [];
        for (let i = 0; i < data[currentQuestion].options.length; i++) {

          newOptions.push(data[currentQuestion].options[i].text)

        }
        setOptions(newOptions);

        // Set up suggestions (suggestion text + suggestion category) for the first question
        const newSuggestions = [];
        for (let i = 0; i < data[currentQuestion].options.length; i++) {

          newSuggestions.push({
            suggestion: data[currentQuestion].options[i].suggestion,
            category: data[currentQuestion].options[i].suggestion_category
          });

        }
        setSuggestions(newSuggestions);

      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {

        // End the loading states after fetching is complete
        setLoading(false);
        
        // Brief delay for smoother UI transition
        await new Promise(res => setTimeout(res, 1000));
        setIsChecking(false);

      }
    };

    fetchQuestions();
  }, []);

  // Handles logic for moving to the next question
  const handleNext = (selectedIndex) => {

    // Update selected option and answers
    setSelectedOption(selectedIndex);
    setAnswers({ ...answers, [currentQuestion]: selectedIndex });
    setShowToast(true); // Show toast
    //setShowModal(true); // Show Modal

    const question_no = currentQuestion + 1

    // Update question text for next question
    setQuestions(api_data[question_no].text);

    // Update options for next question
    const newOptions = [];
    for (let i = 0; i < api_data[question_no].options.length; i++) {

      newOptions.push(api_data[question_no].options[i].text)

    }
    setOptions(newOptions);

    // Update suggestions (suggestion text + suggestion category) for next question
    const newSuggestions = [];
    for (let i = 0; i < api_data[currentQuestion].options.length; i++) {

      newSuggestions.push({
        suggestion: api_data[currentQuestion].options[i].suggestion,
        category: api_data[currentQuestion].options[i].suggestion_category
      });

    }
    setSuggestions(newSuggestions);

    // Update privacy scores based on selected option
    api_data[currentQuestion].options[selectedIndex].scores.forEach(s => {
      if (s.score !== -1) {
        privacyScores.scores[s.code] += s.score;
      }
    });

    // Move to the next question index
    setCurrentQuestion(question_no);

    // Check if the initial survey length has been reached to trigger the "continue" state
    if (currentQuestion + 1 === INITIAL_SURVEY_LENGTH) {
      setContinueSurvey(true)
    }

  };

  // Handles logic for moving to the previous question
  const handleBack = (selectedIndex) => {

    setShowToast(false); // Hide toast

    const question_no = currentQuestion - 1

    // Update question text for previous question
    setQuestions(api_data[question_no].text);

    // Update options for previous question
    const newOptions = [];
    for (let i = 0; i < api_data[question_no].options.length; i++) {

      newOptions.push(api_data[question_no].options[i].text)

    }
    setOptions(newOptions);

    // Update suggestions (suggestion text + suggestion category) for previous question
    const newSuggestions = [];
    for (let i = 0; i < api_data[currentQuestion].options.length; i++) {

      newSuggestions.push({
        suggestion: api_data[currentQuestion].options[i].suggestion,
        category: api_data[currentQuestion].options[i].suggestion_category
      });

    }
    setSuggestions(newSuggestions);

    // Remove scores from the current question since we're going back
    api_data[question_no].options[answers[question_no]].scores.forEach(s => {
      if (s.score !== -1) {
        privacyScores.scores[s.code] -= s.score;
      }
    });

    // Move to the previous question index
    setCurrentQuestion(question_no);

  };

  // Handles the logic for finishing the survey
  const handleFinish = (selectedIndex) => {
    try {

      setShowModal(false);
      var time_delay = 500;

      // If an answer was selected on the final question, process it
      if (typeof selectedIndex == 'number') {
        setSelectedOption(selectedIndex);
        setShowToast(true);
        setIsChecking(true);
        time_delay = 3000;
      }

      // Loop through data from 0 till currentQuestion and sum scores
      // Calculate the maximum possible score for the questions that were answered
      for (let i = 0; i <= currentQuestion; i++) {
        api_data[i].maxScore.forEach(s => {
          privacyScores.maxScores[s.categoryCode] += s.max;
        });
      }

      // Redirect to report page with results
      setTimeout(() => {
        navigate('/report', { state: { scores: privacyScores, questions: api_data, answers: answers } });
      }, time_delay); // delay in milliseconds (2000 = 2s)
    } catch (err) {
      console.error("Error submitting survey:", err);
    }
  };

  // Loader screen (Show a loading spinner while fetching data or generating the report)
  if (isChecking) {
    return (
      <>
        <Navbar_Questions isChecking={isChecking} />
        <Toast
          message={suggestions[user_selected_option]?.suggestion}
          color_category={suggestions[user_selected_option]?.category}
          show={showToast}
          duration={3750}
          onClose={() => setShowToast(false)}
        />
        <div className="flex items-center justify-center min-h-screen bg-gray-50 animate-fade-in-up">
          <svg
            className="animate-spin -ml-1 mr-8 h-20 w-20 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-3xl font-semibold">{continueSurvey ? "Generating Report..." : "Loading Questions..."}</span>
        </div>
      </>
    );
  }

  // Main assessment UI
  return (
    <>
      <Navbar_Questions isChecking={isChecking} />
      <Toast
        message={suggestions[user_selected_option]?.suggestion}
        color_category={suggestions[user_selected_option]?.category}
        show={showToast}
        duration={3750}
        onClose={() => setShowToast(false)}
      />

      {/* Mid-survey continue/stop modal */}
      <ContinueModal
        show={(currentQuestion === Math.floor(api_data.length / 2)) && showModal}
        onContinue={() => setShowModal(false)}
        onStop={handleFinish}
      />

      {/* Main question component */}
      <SurveyQuestion
        title="Privacy Tools Survey"
        progress={(currentQuestion + 1) / (continueSurvey ? api_data.length : INITIAL_SURVEY_LENGTH) * 100}
        questionNumber={currentQuestion + 1}
        totalQuestions={continueSurvey ? api_data.length : INITIAL_SURVEY_LENGTH}
        questionText={questions}
        options={options}
        onBack={handleBack}
        onNext={handleNext}
        onFinish={handleFinish}
        isLastQuestion={currentQuestion === api_data.length - 1}
        selectedOption={answers[currentQuestion]}
      />
    </>
  )
}
