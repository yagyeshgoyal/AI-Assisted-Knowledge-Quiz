import React from 'react';

const QuizHeader = () => {
  return (
    <header className="text-center mb-6 sm:mb-10">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 sm:mb-3">
        Interactive Quiz Generator
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
        Test your knowledge on any topic with AI-generated quizzes
      </p>
    </header>
  );
};

export default QuizHeader;