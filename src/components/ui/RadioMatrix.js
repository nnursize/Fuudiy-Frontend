import React, { useState } from 'react';
import { Grid, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
const responseMapping = {
  "I don't like": "dislikes",
  "I like": "likes",
  "I love": "loves",
  "Sevmiyorum": "dislikes" ,
  "Seviyorum": "likes" ,
   "Çok seviyorum":"loves"
};

const RadioMatrix = ({ question, rows = [], columns = [], onChange, language }) => {
  const [selectedValues, setSelectedValues] = useState({});

  if (!rows.length || !columns.length) {
    return <p>Loading...</p>; // Prevent crashes if data is missing
  }
  
  const handleRadioChange = (row, value) => {
    const rowKey = row.en.toLowerCase().replace(/\s+/g, '_'); // Create a stable key
    const updatedValues = { ...selectedValues, [rowKey]: value };
    setSelectedValues(updatedValues);
    onChange(rowKey, responseMapping[value]);
  };

  return (
    <div>
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>
        {question[language]} {/* Render question text in current language */}
      </Typography>
      <Grid container alignItems="normal" bgcolor={'background.main'} gap={2}>
        <Grid item xs={3}></Grid>
        {columns.map((col, colIndex) => (
          <Grid item xs={2.5} key={colIndex} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {col[language]} {/* Render column headers */}
            </Typography>
          </Grid>
        ))}
        {rows.map((row, rowIndex) => (
          <Grid container spacing={1} alignItems="center" key={rowIndex}>
            <Grid item xs={4}>
              <Typography variant="h6">
                {row[language]} {/* Render row labels */}
              </Typography>
            </Grid>
            {columns.map((col, colIndex) => (
              <Grid item xs={2.5} key={colIndex} sx={{ textAlign: 'center' }}>
                <RadioGroup
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  row
                  name={row[language]}
                  value={selectedValues[row.en.toLowerCase().replace(/\s+/g, '_')] || ''}
                  onChange={(e) => handleRadioChange(row, e.target.value)}
                >
                  <FormControlLabel
                    value={col[language]}
                    control={<Radio />}
                    label=""
                    sx={{ display: 'flex', alignItems: 'center', margin: 0 }}
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
