import React from 'react';

const TopicInput = ({ topic, setTopic, onGenerate, isLoading }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <input
        type="text"
        placeholder="Enter a topic (e.g., 'React Hooks' or 'World War II')"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !isLoading && onGenerate()}
        className="flex-1 px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 shadow-sm text-sm sm:text-base transition-all duration-200"
        disabled={isLoading}
      />
      
      <button
        onClick={onGenerate}
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
  );
};

export default TopicInput;