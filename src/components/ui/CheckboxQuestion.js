import React from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Box, Typography } from '@mui/material';

const CheckboxQuestion = ({ question, options, selected, onChange, twoColumns = false }) => {
  return (
    <div>
      <Typography variant="h6" sx={{ marginBottom: 2, fontSize: 25, font: '' }}>
        {question}
      </Typography>
      <FormGroup
        sx={{
          display: 'grid',
          gridTemplateColumns: twoColumns ? '1fr 1fr' : '1fr',
          gap: '10px', // Space between items
          bgcolor: 'background.main'
        }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            sx={{
              paddingLeft: 5,
              textAlign: 'center'
            }}
            key={index}
            control={
              <Checkbox
                checked={selected.includes(option)}
                onChange={(e) => onChange(option, e.target.checked)}
                color='highlight.dark'
              />
            }
            label={ <Typography variant="h6" sx={{ fontWeight: 400 }}>
            {option}
          </Typography>}
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default CheckboxQuestion;
