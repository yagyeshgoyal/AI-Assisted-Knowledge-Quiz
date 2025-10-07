import { useState, useEffect } from "react";
import React  from 'react'
import FeedbackCard from "../Components/FeedbackCard";
import LoadingSpinner from "../Components/LoadingSpinner";

const FeedbackPage = ({ quizData, topic, score, totalQuestions, onBackToQuiz }) => {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      setError(null);

      const incorrectQuestions = quizData
        .filter(q => q.answered && q.selectedIndex !== q.answerIndex)
        .map(q => ({
          question: q.question,
          userAnswer: q.options[q.selectedIndex],
          correctAnswer: q.answer,
          allOptions: q.options
        }));

      const percentage = Math.round((score / totalQuestions) * 100);

      try {
        const response = await fetch('https://ai-quiz-backend-nsoy.onrender.com/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic,
            totalQuestions,
            correctCount: score,
            incorrectCount: totalQuestions - score,
            percentage,
            incorrectQuestions
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }

        const data = await response.json();
        setFeedback(data.feedback);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to generate feedback. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [quizData, topic, score, totalQuestions]);

  const percentage = Math.round((score / totalQuestions) * 100);
  const incorrectCount = totalQuestions - score;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBackToQuiz}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <span>←</span> Back to Quiz
          </button>
        </div>

        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
            AI-Powered Feedback
          </h1>
          <p className="text-gray-600">Personalized insights on your performance</p>
        </header>

        <div className="space-y-6">
          {/* Score Summary */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 sm:p-8 rounded-2xl shadow-xl text-white">
            <h2 className="text-2xl font-bold mb-4">Quiz Results: {topic}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{score}</div>
                <div className="text-sm opacity-90">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{incorrectCount}</div>
                <div className="text-sm opacity-90">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{percentage}%</div>
                <div className="text-sm opacity-90">Score</div>
              </div>
            </div>
          </div>

          {/* Loading or Error State */}
          {isLoading && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <LoadingSpinner message="Generating personalized feedback..." />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-6 rounded-xl">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* AI Feedback */}
          {feedback && !isLoading && (
            <FeedbackCard title="AI Analysis" icon="🤖">
              <div className="whitespace-pre-wrap">{feedback}</div>
            </FeedbackCard>
          )}

          {/* Incorrect Questions Review */}
          {quizData.filter(q => q.answered && q.selectedIndex !== q.answerIndex).length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📝</span>
                <h3 className="text-xl font-bold text-gray-800">Questions to Review</h3>
              </div>
              <div className="space-y-4">
                {quizData
                  .map((q, idx) => ({ ...q, originalIndex: idx }))
                  .filter(q => q.answered && q.selectedIndex !== q.answerIndex)
                  .map((q, reviewIdx) => (
                    <div key={reviewIdx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-semibold text-gray-800 mb-2">
                        Question {q.originalIndex + 1}: {q.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-red-600">
                          ✗ Your answer: {q.options[q.selectedIndex]}
                        </p>
                        <p className="text-green-600">
                          ✓ Correct answer: {q.answer}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBackToQuiz}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              Review Quiz
            </button>
            <button
              onClick={onBackToQuiz}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-md active:scale-95"
            >
              Start New Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage
