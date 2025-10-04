import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-5 py-3 sm:py-4 rounded-xl shadow-md">
      <div className="flex items-start gap-2 sm:gap-3">
        <span className="text-xl sm:text-2xl flex-shrink-0">⚠️</span>
        <div>
          <strong className="font-bold text-sm sm:text-base">Error:</strong>
          <span className="block sm:inline ml-0 sm:ml-2 text-sm sm:text-base">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;