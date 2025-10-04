import React from 'react';

const ScoreBoard = ({ score, totalQuestions, totalAnswered, onNewQuiz, onViewFeedback }) => {
  const showFeedback = totalAnswered === totalQuestions && totalQuestions > 0;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-2xl shadow-md border border-blue-100">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{score}</div>
          <div className="text-xs sm:text-sm text-gray-500">Correct</div>
        </div>
        <div className="w-px h-10 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">{totalQuestions}</div>
          <div className="text-xs sm:text-sm text-gray-500">Total</div>
        </div>
        <div className="w-px h-10 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{totalAnswered}</div>
          <div className="text-xs sm:text-sm text-gray-500">Answered</div>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        {showFeedback && (
          <button 
            onClick={onViewFeedback} 
            className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-sm sm:text-base"
          >
            View Feedback
          </button>
        )}
        <button 
          onClick={onNewQuiz} 
          className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-sm sm:text-base"
        >
          New Quiz
        </button>
      </div>
    </div>
  );
};

export default ScoreBoard;