import React, { useState } from 'react';
import { Grid, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';

const RadioMatrix = ({ question, rows, columns, onChange }) => {
  const [selectedValues, setSelectedValues] = useState({});

  const handleRadioChange = (row, value) => {
    const updatedValues = { ...selectedValues, [row]: value };
    setSelectedValues(updatedValues);
    onChange(row, value);
  };

  return (
    <div>
      <Typography variant="h6" style={{ marginBottom: '20px' }}>
        {question}
      </Typography>
      <Grid container  alignItems="normal" bgcolor={'background.main'} gap={2}>
        {/* Render column headers */}
        <Grid item xs={4}></Grid>
        {columns.map((col, colIndex) => (
          <Grid item  xs={2} key={colIndex} style={{ textAlign: 'center' }}>
            <Typography   alignItems="center" textAlign={'center'}>{col}</Typography>
          </Grid>
        ))}

        {/* Render rows with radio buttons */}
        {rows.map((row, rowIndex) => (
          <Grid container spacing={2} alignItems="center" key={rowIndex}>
            <Grid  xs={4}>
              <Typography>{row}</Typography>
            </Grid>
            {columns.map((col, colIndex) => (
              <Grid  xs={2.5} key={colIndex} style={{ textAlign: 'center' }}>
                <RadioGroup alignItems="center" sx={{
              justifyContent: 'center'              }}
                  row
                  name={row}
                  value={selectedValues[row] || ''}
                  onChange={(e) => handleRadioChange(row, e.target.value)}
                  color = 'secondary'
                >
                  <FormControlLabel  
                    value={col}
                    control={<Radio color = 'highlight.dark' alignItems="center"  />}
                    label=""
                    style={{ margin: 0 , alignItems:"center"  }}
                    
                  />
                </RadioGroup>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default RadioMatrix;
