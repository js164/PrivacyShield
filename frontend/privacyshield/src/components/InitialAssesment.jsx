import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INITIAL_QUESTION } from "./config/InitialQuestion";
import { Navbar_Questions } from './ui/Navbar';

export default function QuestionPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const question = INITIAL_QUESTION.text;
  const options = INITIAL_QUESTION.options;

  const toggleSelect = (label) => {
    if (selected.includes(label)) {
      setSelected(selected.filter((item) => item !== label));
    } else {
      setSelected([...selected, label]);
    }
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      navigate("/assesment", { state: { initial_answers: selected } });
    }
  };

  return (
    <>
    <Navbar_Questions />
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in-up">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-2xl font-semibold mb-12 text-center">
          {question}
        </h1>

        <div className="grid gap-4">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => toggleSelect(opt.text)}
              className={`cursor-pointer rounded-2xl shadow-md transition transform hover:scale-[1.02] border-2 p-5 text-center font-semibold text-base ${
                selected.includes(opt.text)
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              {opt.text}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            disabled={selected.length === 0}
            onClick={handleSubmit}
            className={`rounded-2xl px-8 py-3 text-lg font-bold shadow-lg transition-all duration-300 ${
              selected.length > 0
                ? "bg-blue-400 text-white rounded-lg hover:bg-primary-blue disabled:opacity-50"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
