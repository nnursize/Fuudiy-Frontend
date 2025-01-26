import React from 'react';
import { TextField } from '@mui/material';

const TextQuestion = ({ question, value, onChange }) => {
  return (
    <div>
      <h3>{question}</h3>
      <TextField
        fullWidth
        focused
        variant="filled" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your response here..."
        color='white'
        sx={{ background: 'white'}}
        
      />
    </div>
  );
};

export default TextQuestion;
