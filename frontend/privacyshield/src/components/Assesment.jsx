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

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {

        const res = await fetch(backend_url+"/question/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        console.log({currentQuestion})
        setAPIData(data)
        console.log({api_data})

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
        privacyScores.scores[s.code] += s.score;
      });

      //privacyScores.scores[api_data.options[selectedIndex].scores.code] += api_data.options[selectedIndex].scores.score;

      setCurrentQuestion(question_no);
      console.log(privacyScores);
      

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
        privacyScores.scores[s.code] -= s.score;
      });

      setCurrentQuestion(question_no);

  };

    const handleFinish = (selectedIndex) => {
    try {
      setShowModal(false);
      var time_delay = 500;
      if (typeof selectedIndex == 'number'){
      setSelectedOption(selectedIndex);
      setShowToast(true);
      time_delay = 3000;
      }

      // Loop through data and sum scores
      api_data.forEach(item => {
        item.maxScore.forEach(s => {
          privacyScores.maxScores[s.categoryCode] += s.max;
        });
      });

        console.log({privacyScores})

      setTimeout(() => {
        navigate('/report', { state: { scores: privacyScores } });
      }, time_delay); // delay in milliseconds (2000 = 2s)
    } catch (err) {
      console.error("Error submitting survey:", err);
    }
  };

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
