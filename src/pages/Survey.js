import React, { useState, useEffect } from 'react';
import CheckboxQuestion from '../components/ui/CheckboxQuestion';
import RadioQuestion from '../components/ui/RadioQuestion';
import RadioMatrix from '../components/ui/RadioMatrix';
import TextQuestion from '../components/ui/TextQuestion';
import SortQuestion from '../components/ui/SortQuestion';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import ScoreQuestion from '../components/ui/ScoreQuestion';

const Survey = () => {
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('/questions.json');
                const data = await response.json();
                setQuestions(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleResponseChange = (id, value) => {
        setResponses((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

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

    const handleSubmit = () => {
        console.log('Survey Responses:', responses);
    };


    if (loading) {
        return <div>Loading survey questions...</div>;
    }

    if (questions.length === 0) {
        return <div>No questions available.</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    const resolveMediaPath = (path) => {
        if (!path) return null;
        try {
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
                width: 600,
                borderRadius: 15,
                bgcolor: 'background.main', // Use theme's background color
                textAlign: 'center',
                padding: 5,
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
                User Preferences
            </Typography>

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
                    twoColumns={currentQuestion.twoColumns || false}
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
                    media={resolveMediaPath(currentQuestion.media)}
                />
            )}

            {currentQuestion.type === 'sort' && (
                <SortQuestion
                    question={currentQuestion.question}
                    options={responses[currentQuestion.id] || currentQuestion.options}
                    onChange={(newOrder) => handleResponseChange(currentQuestion.id, newOrder)}
                />
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <ButtonGroup sx={{ width: '100%', gap: '10px' }}>
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
                           <Typography variant="button" >
                                  Next 
                            </Typography> 
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ flex: 1 }}
                        >
                            <Typography variant="button" >
                                  Next 
                            </Typography> 
                        </Button>
                    )}
                </ButtonGroup>
            </Box>
        </Box>
    );
};

export default Survey;
