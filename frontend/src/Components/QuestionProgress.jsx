import React from 'react';

const QuestionProgress = ({ currentIndex, totalQuestions, quizData }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-sm font-semibold text-gray-500">
        Question {currentIndex + 1} of {totalQuestions}
      </span>
      <div className="flex gap-2">
        {quizData.map((q, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx === currentIndex
                ? 'bg-blue-600 w-6'
                : q.answered
                ? 'bg-green-400'
                : 'bg-gray-300'
            } transition-all duration-200`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionProgress;