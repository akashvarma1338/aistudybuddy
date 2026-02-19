'use client';

import { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface QuizComponentProps {
  questions: Question[];
  onRestart: () => void;
}

export default function QuizComponent({ questions, onRestart }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct ? 1 : 0);
    }, 0);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
          <div className="text-4xl font-bold text-indigo-600 mb-2">
            {score}/{questions.length}
          </div>
          <div className="text-lg text-gray-600">
            {percentage}% Score
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Review Answers:</h4>
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-3">
                  {index + 1}. {question.question}
                </div>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    let className = "p-2 rounded border ";
                    
                    if (optionIndex === question.correct) {
                      className += "bg-green-100 border-green-300 text-green-800";
                    } else if (optionIndex === userAnswer && !isCorrect) {
                      className += "bg-red-100 border-red-300 text-red-800";
                    } else {
                      className += "bg-gray-50 border-gray-200";
                    }
                    
                    return (
                      <div key={optionIndex} className={className}>
                        {String.fromCharCode(65 + optionIndex)}) {option}
                        {optionIndex === question.correct && " ✓"}
                        {optionIndex === userAnswer && !isCorrect && " ✗"}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <RotateCcw size={18} />
          Take Another Quiz
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 ml-4">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedAnswer === index
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span className="font-medium">
                {String.fromCharCode(65 + index)})
              </span>{' '}
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={selectedAnswer === undefined}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        <ChevronRight size={18} />
      </button>
    </div>
  );
}