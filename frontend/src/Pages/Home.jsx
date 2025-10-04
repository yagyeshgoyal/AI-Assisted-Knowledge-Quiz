import React, { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const Home = () => {
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
            console.log("API response:", result);
            
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

    const currentQuestion = quizData[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-6 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 sm:mb-3">
                        Interactive Quiz Generator
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Test your knowledge on any topic with AI-generated quizzes
                    </p>
                </header>

                <main className="space-y-4 sm:space-y-6">
                    {totalQuestions > 0 && (
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
                            <button 
                                onClick={generateQuiz} 
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-sm sm:text-base"
                            >
                                New Quiz
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <input
                            type="text"
                            placeholder="Enter a topic (e.g., 'React Hooks' or 'World War II')"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isLoading && generateQuiz()}
                            className="flex-1 px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 shadow-sm text-sm sm:text-base transition-all duration-200"
                            disabled={isLoading}
                        />
                        
                        <button
                            onClick={generateQuiz}
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </span>
                            ) : 'Generate Quiz'}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-5 py-3 sm:py-4 rounded-xl shadow-md">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <span className="text-xl sm:text-2xl flex-shrink-0">⚠️</span>
                                <div>
                                    <strong className="font-bold text-sm sm:text-base">Error:</strong>
                                    <span className="block sm:inline ml-0 sm:ml-2 text-sm sm:text-base">{error}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentQuestion && (
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-semibold text-gray-500">
                                    Question {currentQuestionIndex + 1} of {totalQuestions}
                                </span>
                                <div className="flex gap-2">
                                    {quizData.map((q, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full ${
                                                idx === currentQuestionIndex
                                                    ? 'bg-blue-600 w-6'
                                                    : q.answered
                                                    ? 'bg-green-400'
                                                    : 'bg-gray-300'
                                            } transition-all duration-200`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                                {currentQuestion.question}
                            </h2>

                            <div className="space-y-3 mb-6">
                                {currentQuestion.options.map((option, optionIndex) => {
                                    const isCorrect = optionIndex === currentQuestion.answerIndex;
                                    const isSelected = optionIndex === currentQuestion.selectedIndex;
                                    const isAnswered = currentQuestion.answered;
                                    
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
                                            key={optionIndex}
                                            type="button"
                                            className={buttonClasses}
                                            disabled={isAnswered || isLoading}
                                            onClick={() => handleAnswerClick(optionIndex)}
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
                                })}
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <span>←</span> Previous
                                </button>

                                <button
                                    onClick={handleNext}
                                    disabled={currentQuestionIndex === totalQuestions - 1}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    Next <span>→</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {isQuizComplete && (
                        <div className="p-6 sm:p-8 text-center bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 rounded-2xl shadow-xl">
                            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2">Quiz Complete!</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-green-600">
                                {score}/{totalQuestions}
                            </p>
                            <p className="text-sm sm:text-base text-gray-600 mt-2">
                                {score === totalQuestions ? "Perfect score! 🌟" : score >= totalQuestions * 0.8 ? "Great job! 👏" : score >= totalQuestions * 0.6 ? "Good effort! 💪" : "Keep practicing! 📚"}
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Home;