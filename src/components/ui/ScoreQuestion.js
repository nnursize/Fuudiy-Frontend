import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { Box, Typography } from '@mui/material';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" size="large" />,
    label: { en: 'Very Dissatisfied', tr: 'Çok Memnuniyetsiz' }, // Example translation for Turkish
  },
  2: {
    icon: <SentimentDissatisfiedIcon size="large" color="error" />,
    label: { en: 'Dissatisfied', tr: 'Memnuniyetsiz' },
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: { en: 'Neutral', tr: 'Neutral' },
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: { en: 'Satisfied', tr: 'Memnun' },
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: { en: 'Very Satisfied', tr: 'Çok Memnun' },
  },
};

function IconContainer(props) {
  const { value, language, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired, // Pass language to IconContainer
};

const ScoreQuestion = ({ question, value, onChange, media, language }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background',
        borderRadius: 2,
        padding: 3,
        textAlign: 'center',
        maxWidth: 400,
        margin: 'auto',
      }}
    >
      {/* Media (Image) */}
      {media && (
        <Box sx={{ marginBottom: 2 }}>
          <img
            src={media}
            style={{ width: '300px', borderRadius: '10px', height: '300px' }}
          />
        </Box>
      )}

      {/* Question */}
      <Typography variant="body1" sx={{ marginBottom: 2, fontSize: 25 }}>
        {question[language]} {/* Display the question in the current language */}
      </Typography>

      {/* Rating */}
      <StyledRating
        name="score-rating"
        value={value || 0}
        IconContainerComponent={(props) => <IconContainer {...props} language={language} />} // Pass language to IconContainer
        getLabelText={(value) => customIcons[value]?.label[language] || ''}
        highlightSelectedOnly
        onChange={(event, newValue) => onChange(newValue)}
        sx={{
          gap: 5, // Space between icons
          '& .MuiRating-icon': {
            fontSize: '5', // Adjust the icon size here
          },
        }}
      />
    </Box>
  );
};

ScoreQuestion.propTypes = {
  question: PropTypes.object.isRequired, // Question should be an object with language keys
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  media: PropTypes.string, // Media is now a string (URL or path)
  language: PropTypes.string.isRequired, // Pass the current language
};

export default ScoreQuestion;
