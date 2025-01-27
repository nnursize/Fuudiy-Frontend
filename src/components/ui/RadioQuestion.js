import React from 'react';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';

const RadioQuestion = ({ question, options, selected, onChange }) => {
  return (
    <div>
      <h3>{question}</h3>
      <RadioGroup
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioQuestion;
