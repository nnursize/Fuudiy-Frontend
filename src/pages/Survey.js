import React, { useState, useEffect } from 'react';
import CheckboxQuestion from '../components/ui/CheckboxQuestion';
import RadioQuestion from '../components/ui/RadioQuestion';
import RadioMatrix from '../components/ui/RadioMatrix';
import TextQuestion from '../components/ui/TextQuestion';
import SortQuestion from '../components/ui/SortQuestion';
import { Box, Button, ButtonGroup } from '@mui/material';
import ScoreQuestion from '../components/ui/ScoreQuestion';

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

    // Helper to dynamically resolve media paths
    const resolveMediaPath = (path) => {
        if (!path) return null;
        try {
            // Use PUBLIC_URL for files in /public or require for /src
            return path.startsWith('/') ? `${process.env.PUBLIC_URL}${path}` : require(`../assets/${path}`);
        } catch (error) {
            console.error(`Error resolving media path: ${path}`, error);
            return null;
        }
    };

    return (
        <Box
            component="section"
            sx={{
                alignContent: 'center',
                justifyContent: 'center',
                display: '-ms-grid',
                width: 550,
                borderRadius: 15,
                bgcolor: 'background.main',
                textAlign: 'center',
                padding: 5,
            }}
        >
            <h1>User Preferences</h1>

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

            {currentQuestion.type === 'score' && (
                <ScoreQuestion
                    question={currentQuestion.question}
                    value={responses[currentQuestion.id] || 0}
                    onChange={(newValue) => handleResponseChange(currentQuestion.id, newValue)}
                    media={resolveMediaPath(currentQuestion.media)} // Dynamically resolve media path
                />
            )}

            {currentQuestion.type === 'sort' && (
                <SortQuestion
                    question={currentQuestion.question}
                    options={responses[currentQuestion.id] || currentQuestion.options}
                    onChange={(newOrder) => handleResponseChange(currentQuestion.id, newOrder)}
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
                        color="primary"
                    >
                        Previous
                    </Button>
                    {currentQuestionIndex < questions.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={goToNextQuestion}
                            sx={{ flex: 1, bgcolor: 'primary' }}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ flex: 1 }}
                        >
                            Submit
                        </Button>
                    )}
                </ButtonGroup>
            </div>
        </Box>
    );
};

export default Survey;
