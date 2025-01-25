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
      <Grid container spacing={2} alignItems="center">
        {/* Render column headers */}
        <Grid item xs={4}></Grid>
        {columns.map((col, colIndex) => (
          <Grid item xs={2} key={colIndex} style={{ textAlign: 'center' }}>
            <Typography>{col}</Typography>
          </Grid>
        ))}

        {/* Render rows with radio buttons */}
        {rows.map((row, rowIndex) => (
          <Grid container spacing={2} alignItems="center" key={rowIndex}>
            <Grid item xs={4}>
              <Typography>{row}</Typography>
            </Grid>
            {columns.map((col, colIndex) => (
              <Grid item xs={2} key={colIndex} style={{ textAlign: 'center' }}>
                <RadioGroup
                  row
                  name={row}
                  value={selectedValues[row] || ''}
                  onChange={(e) => handleRadioChange(row, e.target.value)}
                >
                  <FormControlLabel
                    value={col}
                    control={<Radio />}
                    label=""
                    style={{ margin: 0 }}
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
