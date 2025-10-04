import React from 'react'


const FeedbackCard = ({ title, children, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
};


export default FeedbackCard