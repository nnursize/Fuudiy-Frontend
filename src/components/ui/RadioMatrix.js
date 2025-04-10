import React, { useState } from 'react';
import { Grid, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
const responseMapping = {
  "I don't like": "dislikes",
  "I like": "likes",
  "I love": "loves",
  "Sevmiyorum": "dislikes",
  "Seviyorum": "likes",
  "Çok seviyorum": "loves"
};
const RadioMatrix = ({ question, rows = [], columns = [], onChange, language, values = {} }) => {
  // Create reverse mapping for display values
  const reverseResponseMapping = {
    "dislikes": "I don't like",
    "likes": "I like",
    "loves": "I love",
    // Add other language mappings if needed
  };

  const getDisplayValue = (storedValue) => {
    // Find the column that matches the stored value
    const matchedColumn = columns.find(col =>
      responseMapping[col[language]] === storedValue
    );
    return matchedColumn ? matchedColumn[language] : '';
  };

  const handleRadioChange = (row, value) => {
    const rowKey = row.en.toLowerCase().replace(/\s+/g, '_');
    onChange(rowKey, responseMapping[value]);
  };

  return (
    <div>
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>
        {question[language]}
      </Typography>
      <Grid container alignItems="normal" bgcolor={'background.main'} gap={2}>
        <Grid item xs={3}></Grid>
        {columns.map((col, colIndex) => (
          <Grid item xs={2.5} key={colIndex} sx={{ textAlign: 'center' }}>
            <Typography variant="h6">
              {col[language]}
            </Typography>
          </Grid>
        ))}
        {rows.map((row, rowIndex) => {
          const rowKey = row.en.toLowerCase().replace(/\s+/g, '_');
          const storedValue = values[rowKey];
          const displayValue = getDisplayValue(storedValue);

          return (
            <Grid container spacing={1} alignItems="center" key={rowIndex}>
              <Grid item xs={4}>
                <Typography variant="h6">
                  {row[language]}
                </Typography>
              </Grid>
              {columns.map((col, colIndex) => (
                <Grid item xs={2.5} key={colIndex} sx={{ textAlign: 'center' }}>
                  <RadioGroup
                    row
                    name={row[language]}
                    value={displayValue}
                    onChange={(e) => handleRadioChange(row, e.target.value)}
                  >
                    <FormControlLabel
                      value={col[language]}
                      control={<Radio />}
                      label=""
                    />
                  </RadioGroup>
                </Grid>
              ))}
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default RadioMatrix;
