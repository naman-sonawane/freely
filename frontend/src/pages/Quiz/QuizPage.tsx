import React, { useState } from 'react';
import ProgressionTree from './components/ProgressionTree';
import AppNavbar from '../App Navbar/AppNavbar';
import axios from 'axios';
import Cookies from 'js-cookie';                   

const QuizPage: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizData, setQuizData] = useState({
    question: "Click on a node to generate a quiz question.",
    answers: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
  });
  const [currentNode, setCurrentNode] = useState<string | null>(null);

  const username = Cookies.get('username');      

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
  };

  const handleNodeClick = async (nodeName: string) => {
    setCurrentNode(nodeName);
    generateQuizQuestion(nodeName);
  };

  const generateQuizQuestion = async (nodeName: string) => {
    try {
      const prompt = `
        Generate a quiz question based on the topic "${nodeName}". Provide four answer options, specify the correct answer, and provide a brief explanation. The correct answer will be randomly placed.
        Return the result in the following JSON format:
        {
          "question": "Your question here",
          "answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
          "correctAnswer": "The correct answer",
          "explanation": "A brief explanation"
        }
      `;
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/upload', { prompt });
      const quizContent = response.data.description;
      const quizJson = quizContent.replace(/```json\n|\n```/g, '').trim();
      const newQuizData = JSON.parse(quizJson);

      setQuizData(newQuizData);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } catch (error) {
      console.error('Error generating quiz question:', error);
      setQuizData({
        question: "Error generating question. Please try again.",
        answers: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentNode) {
      generateQuizQuestion(currentNode);
    }
  };

  const handleAddToInterests = async () => {
    if (currentNode && username) {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/users/profile`, {
          params: { username }
        });
        const updatedInterests = [...data.interests, currentNode];
        const response = await axios.put(import.meta.env.VITE_BACKEND_URL + '/api/users/profile', {
          username,
          interests: updatedInterests,
        });
        console.log(response.data.message);
        alert(`${currentNode} added to interests!`);
      } catch (error) {
        console.error('Error adding to interests:', error);
      }
    }
  };
  

  const handleAddToGoals = async () => {
    if (currentNode && username) {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/users/profile`, {
          params: { username }
        });
        const updatedGoals = [...data.goals, currentNode];
        const response = await axios.put(import.meta.env.VITE_BACKEND_URL + '/api/users/profile', {
          username,
          goals: updatedGoals,
        });
        console.log(response.data.message);
        alert(`${currentNode} added to goals!`);
      } catch (error) {
        console.error('Error adding to goals:', error);
      }
    }
  };
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <AppNavbar />

      <div className="flex h-[calc(100vh-60px)]">
        <div className="w-1/2 h-full p-5 bg-white rounded-lg border border-gray-300 shadow-md m-2 flex flex-col">
          <div className="flex-grow">
            <ProgressionTree onNodeClick={handleNodeClick} />
          </div>
        </div>

        <div className="w-1/2 h-full p-5 overflow-y-auto bg-gray-50 rounded-lg border border-gray-300 shadow-md m-2 flex flex-col justify-center items-center">
          {currentNode && (
            <h3 className="mb-4 text-center text-lg font-semibold text-blue-600">
              Topic: {currentNode}
            </h3>
          )}
          <h2 className="mb-10 text-center text-xl font-semibold">{quizData.question}</h2>
          <div className="grid grid-cols-2 gap-5">
            {quizData.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                className={`flex justify-center items-center p-3 rounded-lg font-medium text-center ${
                  selectedAnswer === answer
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                } border border-gray-300 cursor-pointer min-w-[180px]`}
                style={{ minHeight: '60px', height: 'auto' }}
              >
                {answer}
              </button>
            ))}
          </div>
          {showExplanation && (
            <div className="mt-10 text-center">
              <h4 className={selectedAnswer === quizData.correctAnswer ? 'text-green-500' : 'text-red-500'}>
                {selectedAnswer === quizData.correctAnswer ? 'Correct!' : 'Incorrect.'}
              </h4>
              <p>{quizData.explanation}</p>
            </div>
          )}
          <div className="mt-10 flex space-x-4">
            <button
              onClick={handleNextQuestion}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              disabled={!currentNode}
            >
              Next Question
            </button>
            <button
              onClick={handleAddToInterests}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={!currentNode}
            >
              Add to Interests
            </button>
            <button
              onClick={handleAddToGoals}
              className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              disabled={!currentNode}
            >
              Add to Goals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;