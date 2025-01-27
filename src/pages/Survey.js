import React, { useState, useEffect } from 'react';
import CheckboxQuestion from '../components/ui/CheckboxQuestion';
import RadioMatrix from '../components/ui/RadioMatrix';
import TextQuestion from '../components/ui/TextQuestion';
import ScoreQuestion from '../components/ui/ScoreQuestion';
import { Box, Button, Typography } from '@mui/material';
import LanguageSwitcher from '../components/LanguageSwitcher';

import { useTranslation } from 'react-i18next';

const Survey = () => {
    const { t, i18n } = useTranslation("global");
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
        alert('Thank you for completing the survey!');
    };

    if (loading) {
        return <Typography>Loading survey questions...</Typography>;
    }

    if (questions.length === 0) {
        return <Typography>No questions available.</Typography>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const language = i18n.language; // Get the current language from i18n

    const resolveMediaPath = (path) => {
        if (!path) return null;
        try {
            return path.startsWith('/') ? `${process.env.PUBLIC_URL}${path}` : require(`../assets/${path}`);
        } catch (error) {
            console.error(`Error resolving media path: ${path}`, error);
            return null;
        }
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
            .then(() => console.log(`Language changed to: ${lng}`))
            .catch((err) => console.error("Language switch failed:", err));
    };

    return (
        <>
            <Box position='relative'>
                <LanguageSwitcher color='white' changeLanguage={changeLanguage} />
            </Box>
            <Box
                sx={{
                    width: 600,
                    borderRadius: 15,
                    bgcolor: 'background.main',
                    textAlign: 'center',
                    padding: 5,
                    margin: 'auto',
                }}
            >
                <Typography variant="h6" color='grey' sx={{ marginBottom: 3 }}>
                    {t('user_pref')}
                </Typography>

                {/* Render the current question dynamically */}
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
                        language={language} // Pass the current language to the component
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
    language={i18n.language}  // Pass the current language to RadioMatrix
  />
)}


{currentQuestion.type === 'score' && (
  <ScoreQuestion
    question={currentQuestion.question}
    value={responses[currentQuestion.id] || 0}
    onChange={(value) => handleResponseChange(currentQuestion.id, value)}
    media={resolveMediaPath(currentQuestion.media)}
    language={i18n.language}  // Pass the current language to ScoreQuestion
  />
)}

{currentQuestion.type === 'text' && (
  <TextQuestion
    question={currentQuestion.question}
    value={responses[currentQuestion.id] || ''}
    onChange={(value) => handleResponseChange(currentQuestion.id, value)}
    language={i18n.language}  // Pass the current language to TextQuestion
  />
)}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={goToPreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        {t('previous')}
                    </Button>

                    {currentQuestionIndex < questions.length - 1 ? (
                        <Button variant="contained" onClick={goToNextQuestion}>
                            {t('next')}
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            {t('submit')}
                        </Button>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default Survey;
