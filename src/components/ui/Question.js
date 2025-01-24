import React from 'react';

const Question = ({ question, type, options, onChange, value }) => {
  return (
    <div className="mb-6">
      <label className="block text-lg font-medium text-gray-700 mb-2">{question}</label>

      {type === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
      )}

      {type === 'radio' && (
        <div className="flex flex-col space-y-2">
          {options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name={question}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      {type === 'select' && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        >
          <option value="" disabled>Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Question;
