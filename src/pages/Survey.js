import React, { useState, useEffect } from 'react';
import CheckboxQuestion from '../components/ui/CheckboxQuestion';
import RadioQuestion from '../components/ui/RadioQuestion';
import RadioMatrix from '../components/ui/RadioMatrix';

import TextQuestion from '../components/ui/TextQuestion';
import { Button, ButtonGroup } from '@mui/material';

const Survey = () => {
    const [questions, setQuestions] = useState([]); // To store questions from JSON
    const [responses, setResponses] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true); // To track loading state

    // Fetch questions from JSON file
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('/questions.json'); // Path to the JSON file
                const data = await response.json();
                setQuestions(data);
                setLoading(false); // Set loading to false after fetching
            } catch (error) {
                console.error('Error fetching questions:', error);
                setLoading(false); // Stop loading if there's an error
            }
        };

        fetchQuestions();
    }, []);

    // Handle responses for each question type
    const handleResponseChange = (id, value) => {
        setResponses((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Navigation logic
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    // Handle submission
    const handleSubmit = () => {
        console.log('Survey Responses:', responses);
        // Handle submission logic here (e.g., send responses to a server)
    };

    // Show loading state
    if (loading) {
        return <div>Loading survey questions...</div>;
    }

    // Handle case where no questions are loaded
    if (questions.length === 0) {
        return <div>No questions available.</div>;
    }

    // Get the current question
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1>Survey</h1>


            {/* Render the current question */}
            {currentQuestion.type === 'checkbox' && (
                <CheckboxQuestion
                    question={currentQuestion.question}
                    options={currentQuestion.options}
                    selected={responses[currentQuestion.id] || []}
                    onChange={(option, isChecked) => {
                        const currentSelections = responses[currentQuestion.id] || [];
                        const newSelections = isChecked
                            ? [...currentSelections, option]
                            : currentSelections.filter((item) => item !== option);
                        handleResponseChange(currentQuestion.id, newSelections);
                    }}
                    twoColumns={currentQuestion.twoColumns || false} // Pass the value from JSON
                />
            )}

{currentQuestion.type === 'radio' && currentQuestion.rows && currentQuestion.columns && (
        <RadioMatrix
          question={currentQuestion.question}
          rows={currentQuestion.rows}
          columns={currentQuestion.columns}
          onChange={(row, value) => {
            const newResponses = { ...responses[currentQuestion.id], [row]: value };
            handleResponseChange(currentQuestion.id, newResponses);
          }}
        />
      )}

            {currentQuestion.type === 'text' && (
                <TextQuestion
                    question={currentQuestion.question}
                    value={responses[currentQuestion.id] || ''}
                    onChange={(value) => handleResponseChange(currentQuestion.id, value)}
                />
            )}

            {/* Navigation Buttons */}
            <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  }}
>
  <ButtonGroup
    sx={{
      width: '100%',
      gap: '10px', // Add space between buttons
      '@media (max-width: 600px)': {
        flexDirection: 'column', // Stack buttons on smaller screens
        alignItems: 'center',
      },
    }}
  >
    <Button
      variant="contained"
      onClick={goToPreviousQuestion}
      disabled={currentQuestionIndex === 0}
      sx={{ flex: 1 }}
    >
      Previous
    </Button>
    {currentQuestionIndex < questions.length - 1 ? (
      <Button variant="contained" onClick={goToNextQuestion} sx={{ flex: 1 }}>
        Next
      </Button>
    ) : (
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ flex: 1 }}>
        Submit
      </Button>
    )}
  </ButtonGroup>
</div>

        </div>
    );
};

export default Survey;
