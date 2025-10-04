import React from 'react';

const AnswerOption = ({ option, optionIndex, isCorrect, isSelected, isAnswered, isLoading, onClick }) => {
  let buttonClasses = 'w-full text-left p-4 rounded-xl transition-all duration-200 font-medium';

  if (isAnswered) {
    if (isSelected) {
      buttonClasses += isCorrect 
        ? ' bg-green-100 border-2 border-green-500 text-green-800 shadow-md'
        : ' bg-red-100 border-2 border-red-500 text-red-800 shadow-md';
    } else if (isCorrect) {
      buttonClasses += ' bg-green-50 border-2 border-green-300 text-green-700';
    } else {
      buttonClasses += ' bg-gray-50 border border-gray-200 text-gray-500';
    }
  } else {
    buttonClasses += ' bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]';
  }

  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={isAnswered || isLoading}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
            {String.fromCharCode(65 + optionIndex)}
          </span>
          <span className="text-base">{option}</span>
        </div>
        {isAnswered && isSelected && (
          <span className="text-2xl ml-2 flex-shrink-0">
            {isCorrect ? '✓' : '✗'}
          </span>
        )}
        {isAnswered && !isSelected && isCorrect && (
          <span className="text-xl ml-2 flex-shrink-0">✓</span>
        )}
      </div>
    </button>
  );
};

export default AnswerOption;