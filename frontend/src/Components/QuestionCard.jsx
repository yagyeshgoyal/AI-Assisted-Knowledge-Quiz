import React from 'react';
import QuestionProgress from './QuestionProgress';
import AnswerOption from './AnswerOption';

const QuestionCard = ({ 
  question, 
  currentIndex, 
  totalQuestions, 
  quizData,
  isLoading,
  onAnswerClick,
  onPrevious,
  onNext
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
      <QuestionProgress 
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        quizData={quizData}
      />

      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        {question.question}
      </h2>

      <div className="space-y-3 mb-6">
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.answerIndex;
          const isSelected = optionIndex === question.selectedIndex;
          const isAnswered = question.answered;

          return (
            <AnswerOption
              key={optionIndex}
              option={option}
              optionIndex={optionIndex}
              isCorrect={isCorrect}
              isSelected={isSelected}
              isAnswered={isAnswered}
              isLoading={isLoading}
              onClick={() => onAnswerClick(optionIndex)}
            />
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>←</span> Previous
        </button>

        <button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;