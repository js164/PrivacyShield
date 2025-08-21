import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SurveyQuestion from "./ui/QuestionDisplay";
import { Navbar_Questions } from './ui/Navbar';
import Toast from "./ui/QuestionSuggestion";
import ContinueModal from './ui/Dialog';
const backend_url = import.meta.env.VITE_BACKEND_URI;

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

export default function Assesment() {

  const navigate = useNavigate();
  const location = useLocation();
  const { initial_answers } = location.state || { initial_answers: [] }; // fallback if no state

  // console.log(initial_answers)

  // Redirect if user opens /assesment directly or has no answers
  useEffect(() => {
    if (!initial_answers || initial_answers.length === 0) {
      navigate("/initialassesment", { replace: true });
    }
  }, [initial_answers, navigate]);

  const [api_data, setAPIData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [options, setOptions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [user_selected_option, setSelectedOption] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {

        const res = await fetch(backend_url+"/question/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const fetched_data = await res.json();
        const data = [...fetched_data].sort(() => Math.random() - 0.5);
        // console.log({currentQuestion})
        setAPIData(data)
        // console.log({api_data})

        setQuestions(data[currentQuestion].text); // Assuming `data` is an array of questions

        const newOptions = [];

      for (let i = 0; i < data[currentQuestion].options.length; i++) {

        newOptions.push(data[currentQuestion].options[i].text)

      }

      setOptions(newOptions);

      const newSuggestions = [];

      for (let i = 0; i < data[currentQuestion].options.length; i++) {

        newSuggestions.push(data[currentQuestion].options[i].suggestion)

      }

      setSuggestions(newSuggestions);

      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
        await new Promise(res => setTimeout(res, 1000));
        setIsChecking(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleNext = (selectedIndex) => {

    // console.log(api_data.length)
    // console.log(selectedIndex)
    // console.log(api_data)

    setSelectedOption(selectedIndex);
    setAnswers({ ...answers, [currentQuestion]: selectedIndex });
    setShowToast(true); // Show toast
    setShowModal(true); // Show Modal

    const question_no = currentQuestion + 1

    setQuestions(api_data[question_no].text); // Assuming `data` is an array of questions

            const newOptions = [];

      for (let i = 0; i < api_data[question_no].options.length; i++) {

        newOptions.push(api_data[question_no].options[i].text)

      }

      setOptions(newOptions);

      const newSuggestions = [];

      for (let i = 0; i < api_data[currentQuestion].options.length; i++) {

        newSuggestions.push(api_data[currentQuestion].options[i].suggestion)

      }

      setSuggestions(newSuggestions);

      //console.log(api_data)

      api_data[currentQuestion].options[selectedIndex].scores.forEach(s => {
        if (s.score !== -1) {
          privacyScores.scores[s.code] += s.score;
        }
      });

      //privacyScores.scores[api_data.options[selectedIndex].scores.code] += api_data.options[selectedIndex].scores.score;

      setCurrentQuestion(question_no);
      // console.log(privacyScores);
      

  };

  const handleBack = (selectedIndex) => {

    const question_no = currentQuestion - 1

    setQuestions(api_data[question_no].text); // Assuming `data` is an array of questions

            const newOptions = [];

      for (let i = 0; i < api_data[question_no].options.length; i++) {

        newOptions.push(api_data[question_no].options[i].text)

      }

      setOptions(newOptions);

      const newSuggestions = [];

      for (let i = 0; i < api_data[currentQuestion].options.length; i++) {

        newSuggestions.push(api_data[currentQuestion].options[i].suggestion)

      }

      setSuggestions(newSuggestions);

      api_data[question_no].options[answers[question_no]].scores.forEach(s => {
        if (s.score !== -1) {
          privacyScores.scores[s.code] -= s.score;
        }
      });

      setCurrentQuestion(question_no);

  };

    const handleFinish = (selectedIndex) => {
    try {
      console.log(currentQuestion)
      setShowModal(false);
      var time_delay = 500;
      if (typeof selectedIndex == 'number'){
      setSelectedOption(selectedIndex);
      setShowToast(true);
      time_delay = 3000;
      }

      // Loop through data and sum scores
      /*
      api_data.forEach(item => {
        item.maxScore.forEach(s => {
          privacyScores.maxScores[s.categoryCode] += s.max;
        });
      });
      */

      // Loop through data from 0 till currentQuestion and sum scores
      for (let i = 0; i <= currentQuestion; i++) {
        api_data[i].maxScore.forEach(s => {
          privacyScores.maxScores[s.categoryCode] += s.max;
        });
      }

        // console.log({privacyScores})

      setTimeout(() => {
        navigate('/report', { state: { scores: privacyScores } });
      }, time_delay); // delay in milliseconds (2000 = 2s)
    } catch (err) {
      console.error("Error submitting survey:", err);
    }
  };

  if (isChecking) {
    return (
    <>
    <Navbar_Questions />
      <div className="flex items-center justify-center min-h-screen animate-fade-in-up">
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
        <span className="text-3xl font-semibold">Loading Questions...</span>
      </div>
      </>
    );
  }

  return (
    <>
    <Navbar_Questions />
    <Toast
      message={suggestions[user_selected_option]}
      show={showToast}
      duration={3000}
      onClose={() => setShowToast(false)}
    />

<ContinueModal
  show={(currentQuestion === Math.floor(api_data.length/2)) && showModal}
  onContinue={() => setShowModal(false)}
  onStop={handleFinish}
/>

    <SurveyQuestion
      title="Privacy Tools Survey"
      progress={(currentQuestion + 1) / api_data.length * 100}
      questionNumber={currentQuestion+1}
      totalQuestions={api_data.length}
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
