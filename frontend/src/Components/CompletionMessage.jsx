import React from 'react';

const CompletionMessage = ({ score, totalQuestions }) => {
  const percentage = score / totalQuestions;
  
  const getMessage = () => {
    if (score === totalQuestions) return "Perfect score! 🌟";
    if (percentage >= 0.8) return "Great job! 👏";
    if (percentage >= 0.6) return "Good effort! 💪";
    return "Keep practicing! 📚";
  };

  return (
    <div className="p-6 sm:p-8 text-center bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 rounded-2xl shadow-xl">
      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
      <h3 className="text-xl sm:text-2xl font-bold mb-2">Quiz Complete!</h3>
      <p className="text-2xl sm:text-3xl font-bold text-green-600">
        {score}/{totalQuestions}
      </p>
      <p className="text-sm sm:text-base text-gray-600 mt-2">
        {getMessage()}
      </p>
    </div>
  );
};

export default CompletionMessage;