import React from 'react';
import { FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';

const CheckboxQuestion = ({ question, options, selected, onChange, twoColumns = false, language }) => {
  return (
    <div>
      <Typography variant="h6" sx={{ marginBottom: 2, fontSize: 25 }}>
        {question[language]}
      </Typography>
      <FormGroup
        sx={{
          display: 'grid',
          gridTemplateColumns: twoColumns ? '1fr 1fr' : '1fr',
          gap: '10px',
          bgcolor: 'background.main'
        }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            sx={{
              paddingLeft: 5,
              textAlign: 'center'
            }}
            control={
              <Checkbox
                checked={selected.includes(option.value)}
                onChange={(e) => onChange(option, e.target.checked)}
                color="highlight.dark"
              />
            }
            label={
              <Typography variant="h6" sx={{ fontWeight: 400 }}>
                {option[language]}
              </Typography>
            }
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default CheckboxQuestion;
