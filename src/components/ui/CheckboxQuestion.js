import React from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const CheckboxQuestion = ({ question, options, selected, onChange, twoColumns = false }) => {
  return (
    <div>
      <h3 style={{padding: 10  }}>{question}</h3>
      <FormGroup
        sx={{
          display: 'grid',
          gridTemplateColumns: twoColumns ? '1fr 1fr' : '1fr',
          gap: '10px', // Space between items
          bgcolor: 'secondary.light'
        }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            sx={{ paddingLeft:5,
              textAlign : 'center'}}
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
