import React from 'react';
import { useState, useCallback } from 'react';
import FeedbackPage from './FeedbackPage';

import QuizHeader from '../Components/QuizHeader';
import ScoreBoard from '../Components/ScoreBoard';
import TopicInput from '../Components/TopicInput';
import ErrorMessage from '../Components/ErrorMessage';
import QuestionCard from '../Components/QuestionCard';
import CompletionMessage from '../Components/CompletionMessage';
import { useQuizLogic } from '../useQuizLogic';

const Home = () => {
  const [currentPage, setCurrentPage] = useState('quiz'); // 'quiz' or 'feedback'
  const [topic, setTopic] = useState('web development');
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalQuestions = quizData.length;
  const isQuizComplete = totalQuestions > 0 && totalAnswered === totalQuestions;

  const generateQuiz = useCallback(async () => {
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setError("Please enter a topic before generating questions.");
      return;
    }

    setQuizData([]);
    setScore(0);
    setTotalAnswered(0);
    setCurrentQuestionIndex(0);
    setError(null);
    setIsLoading(true);
    setCurrentPage('quiz');

    try {
      const response = await fetch('https://ai-quiz-backend-nsoy.onrender.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: trimmedTopic })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate quiz');
      }

      const result = await response.json();
      
      if (response.ok && result) {
        const initialQuizData = result.map(q => {
          const answerIndex = q.options.findIndex(opt => opt === q.answer);
          return {
            question: q.question,
            options: q.options,
            answer: q.answer,
            answerIndex: answerIndex,
            answered: false,
            selectedIndex: -1,
          };
        });
        setQuizData(initialQuizData);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError(err.message || "Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  const handleAnswerClick = useCallback((optionIndex) => {
    setQuizData(prevData => {
      const newData = [...prevData];
      const question = newData[currentQuestionIndex];

      if (question.answered) return prevData;

      question.answered = true;
      question.selectedIndex = optionIndex;

      let newScore = 0;
      let newAnswered = 0;
      
      newData.forEach(q => {
        if (q.answered) {
          newAnswered++;
          if (q.selectedIndex === q.answerIndex) newScore++;
        }
      });

      setScore(newScore);
      setTotalAnswered(newAnswered);

      return newData;
    });
  }, [currentQuestionIndex]);

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleViewFeedback = () => {
    setCurrentPage('feedback');
  };

  const handleBackToQuiz = () => {
    setCurrentPage('quiz');
  };

  const currentQuestion = quizData[currentQuestionIndex];

  if (currentPage === 'feedback') {
    return (
      <FeedbackPage
        quizData={quizData}
        topic={topic}
        score={score}
        totalQuestions={totalQuestions}
        onBackToQuiz={handleBackToQuiz}
      />
    );
  }

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
              onViewFeedback={handleViewFeedback}
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
              onViewFeedback={handleViewFeedback}
            />
          )}
        </main>
      </div>
    </div>
  );
};


export default Home;