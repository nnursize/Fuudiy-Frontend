import React, { useState } from 'react';
import { Grid, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';

const RadioMatrix = ({ question, rows, columns, onChange, language }) => {
  const [selectedValues, setSelectedValues] = useState({});

  const handleRadioChange = (row, value) => {
    const updatedValues = { ...selectedValues, [row]: value };
    setSelectedValues(updatedValues);
    onChange(row, value);
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        {question[language]} {/* Render the question text based on the current language */}
      </Typography>
      <Grid container alignItems="normal" bgcolor={'background.main'} gap={2}>
        {/* Render column headers */}
        <Grid item xs={3}></Grid>
        {columns.map((col, colIndex) => (
          <Grid item xs={2.5} key={colIndex} style={{ textAlign: 'center' }}>
            <Typography variant="h6" alignItems="center" textAlign={'center'}>
              {col[language]} {/* Render each column header based on the current language */}
            </Typography>
          </Grid>
        ))}

        {/* Render rows with radio buttons */}
        {rows.map((row, rowIndex) => (
          <Grid container spacing={1} alignItems="center" key={rowIndex}>
            <Grid item xs={4}>
              <Typography variant="h6">
                {row[language]} {/* Render each row label based on the current language */}
              </Typography>
            </Grid>
            {columns.map((col, colIndex) => (
              <Grid item xs={2.5} key={colIndex} style={{ textAlign: 'center' }}>
                <RadioGroup
                  alignItems="center"
                  sx={{ justifyContent: 'center' }}
                  row
                  name={row[language]} 
                  value={selectedValues[row[language]] || ''}
                  onChange={(e) => handleRadioChange(row[language], e.target.value)}
                  color="secondary"
                >
                  <FormControlLabel
                    value={col[language]} 
                    control={<Radio color="highlight.dark" alignItems="center" />}
                    label=""
                    style={{ margin: 0, alignItems: "center" }}
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
