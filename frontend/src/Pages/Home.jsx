import React from 'react';

import QuizHeader from '../Components/QuizHeader';
import ScoreBoard from '../Components/ScoreBoard';
import TopicInput from '../Components/TopicInput';
import ErrorMessage from '../Components/ErrorMessage';
import QuestionCard from '../Components/QuestionCard';
import CompletionMessage from '../Components/CompletionMessage';
import { useQuizLogic } from '../useQuizLogic';

const Home = () => {
  const {
    topic,
    setTopic,
    quizData,
    currentQuestionIndex,
    score,
    totalAnswered,
    totalQuestions,
    isLoading,
    error,
    isQuizComplete,
    generateQuiz,
    handleAnswerClick,
    handleNext,
    handlePrevious
  } = useQuizLogic();

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <QuizHeader />

        <main className="space-y-4 sm:space-y-6">
          {totalQuestions > 0 && (
            <ScoreBoard 
              score={score}
              totalQuestions={totalQuestions}
              totalAnswered={totalAnswered}
              onNewQuiz={generateQuiz}
            />
          )}

          <TopicInput 
            topic={topic}
            setTopic={setTopic}
            onGenerate={generateQuiz}
            isLoading={isLoading}
          />

          <ErrorMessage message={error} />

          {currentQuestion && (
            <QuestionCard 
              question={currentQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              quizData={quizData}
              isLoading={isLoading}
              onAnswerClick={handleAnswerClick}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          )}

          {isQuizComplete && (
            <CompletionMessage 
              score={score}
              totalQuestions={totalQuestions}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;