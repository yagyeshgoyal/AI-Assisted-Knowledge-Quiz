import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

export const useQuizLogic = () => {
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

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
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

  return {
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
  };
};