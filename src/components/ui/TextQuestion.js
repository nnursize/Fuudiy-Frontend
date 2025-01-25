import React from 'react';
import { TextField } from '@mui/material';

const TextQuestion = ({ question, value, onChange }) => {
  return (
    <div>
      <h3>{question}</h3>
      <TextField
        fullWidth
        variant="outlined"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your response here..."
      />
    </div>
  );
};

export default TextQuestion;
