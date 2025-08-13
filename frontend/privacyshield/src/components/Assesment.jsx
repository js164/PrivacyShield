import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SurveyQuestion from "./ui/QuestionDisplay";
import { Navbar_Questions } from './ui/Navbar';
import Toast from "./ui/QuestionSuggestion";

export default function Assesment() {
  const [api_data, setAPIData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {

        const res = await fetch("http://localhost:8000/question/questions");
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

      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleNext = (selectedIndex) => {

    setShowToast(true); // Show toast

    const question_no = currentQuestion + 1

    setQuestions(api_data[question_no].text); // Assuming `data` is an array of questions

            const newOptions = [];

      for (let i = 0; i < api_data[question_no].options.length; i++) {

        newOptions.push(api_data[question_no].options[i].text)

      }

      setOptions(newOptions);
      setCurrentQuestion(question_no);

  };

  const handleBack = (selectedIndex) => {

    const question_no = currentQuestion - 1

    setQuestions(api_data[question_no].text); // Assuming `data` is an array of questions

            const newOptions = [];

      for (let i = 0; i < api_data[question_no].options.length; i++) {

        newOptions.push(api_data[question_no].options[i].text)

      }

      setOptions(newOptions);
      setCurrentQuestion(question_no);

  };

    const handleFinish = async () => {
    try {
      setShowToast(true);
      window.location.href = "/report";
    } catch (err) {
      console.error("Error submitting survey:", err);
    }
  };

  return (
    <>
    <Navbar_Questions />
    <Toast
      message={questions}
      show={showToast}
      duration={2000}
      onClose={() => setShowToast(false)}
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
    />
    </>
  )
}
