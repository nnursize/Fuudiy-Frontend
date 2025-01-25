import React from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const CheckboxQuestion = ({ question, options, selected, onChange }) => {
  return (
    <div>
      <h3>{question}</h3>
      <FormGroup>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selected.includes(option)}
                onChange={(e) => onChange(option, e.target.checked)}
              />
            }
            label={option}
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default CheckboxQuestion;
