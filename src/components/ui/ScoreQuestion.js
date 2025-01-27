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
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon size="large" color="error" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

const ScoreQuestion = ({ question, value, onChange, media }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background',
        borderRadius: 2,
        padding: 3,
        textAlign: 'center',
        maxWidth: 400,
        margin: 'auto'
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
      <Typography variant="body1" sx={{ marginBottom: 2, fontSize: 25, font: '' }}>
        {question}
      </Typography>

      {/* Rating */}
      <StyledRating
        name="score-rating"
        value={value || 0}
        IconContainerComponent={IconContainer}
        getLabelText={(value) => customIcons[value]?.label || ''}
        highlightSelectedOnly
        onChange={(event, newValue) => onChange(newValue)}
        sx={{
          gap: 5, // Space between icons
          '& .MuiRating-icon': {
            fontSize: '5', // Adjust the icon size here (e.g., 3rem = 48px)
          },
        }}
      />
    </Box>
  );
};

ScoreQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  media: PropTypes.string, // Media is now a string (e.g., a URL or path)
};

export default ScoreQuestion;
