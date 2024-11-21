import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Survey.css';

function Survey() {
  const { t, i18n } = useTranslation("global");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch questions from the JSON file
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/questions.json`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Handle selection change for checkboxes and radio buttons
  const handleOptionChange = (option, row = null) => {
    setSelectedOptions((prevSelected) => {
      if (row) {
        // Matrix radio selection: one option per row
        return {
          ...prevSelected,
          [row]: option
        };
      } else {
        // Checkbox selection: multiple options
        const updatedSelections = prevSelected[currentQuestionIndex] || [];
        return {
          ...prevSelected,
          [currentQuestionIndex]: updatedSelections.includes(option)
            ? updatedSelections.filter((o) => o !== option)
            : [...updatedSelections, option]
        };
      }
    });
  };

  // Handle next and previous button clicks
  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
    setSelectedOptions({});
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  // Handle submit button click
  const handleSubmit = () => {
    alert(`${t('submit')}: ${JSON.stringify(selectedOptions)}`);
  };

  // Change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Render loading state or question
  if (questions.length === 0) {
    return <div>{t('loading')}</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="survey-container">
      {/* Language Switcher */}
      <div className="language-switch">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('tr')}>TR</button>
      </div>

      <h2>{t('survey_question')} {currentQuestionIndex + 1} {t('of')} {questions.length}</h2>
      <p>{currentQuestion.title}</p>
      <div className="options-container">
        {/* Render options based on question type */}
        {currentQuestion.type === 'checkbox' && currentQuestion.choices && (
          currentQuestion.choices.map((choice, index) => (
            <label key={index} className="option-label">
              <input
                type="checkbox"
                value={choice.value || choice}
                checked={(selectedOptions[currentQuestionIndex] || []).includes(choice.value || choice)}
                onChange={() => handleOptionChange(choice.value || choice)}
              />
              {choice.text || choice}
            </label>
          ))
        )}

        {currentQuestion.type === 'text' && (
          <input
            type="text"
            value={selectedOptions[currentQuestionIndex]?.[0] || ""}
            onChange={(e) => setSelectedOptions({ [currentQuestionIndex]: [e.target.value] })}
            placeholder={t('your_answer')}
          />
        )}

        {currentQuestion.type === 'matrix' && (
          <div className="matrix-container">
            {currentQuestion.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="matrix-row">
                <span>{row.text}</span>
                {currentQuestion.columns.map((col, colIndex) => (
                  <label key={colIndex} className="matrix-option">
                    <input
                      type="radio"
                      name={`matrix-${row.value}`}
                      value={col.value}
                      checked={selectedOptions[row.value] === col.value}
                      onChange={() => handleOptionChange(col.value, row.value)}
                    />
                    {col.text}
                  </label>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navigation-buttons">
        <button onClick={handlePrev} disabled={currentQuestionIndex === 0}>
          {t('previous')}
        </button>
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={handleNext}>
            {t('next')}
          </button>
        ) : (
          <button onClick={handleSubmit}>
            {t('submit')}
          </button>
        )}
      </div>
    </div>
  );
}

export default Survey;
