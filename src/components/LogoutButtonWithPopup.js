import React, { useState } from 'react';
import { Button } from '@mui/material';
import LogoutPopup from './LogoutPopup';

const LogoutButtonWithPopup = () => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    console.log('User logged out'); 
    setOpen(false); 
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => setOpen(true)}
        sx={{ 
          padding: '4px 8px',  // Smaller padding
          fontSize: '0.75rem',  // Smaller text
          minWidth: 'auto',  // Prevents excessive width
          height: '40px',  // Adjusted height
          backgroundColor: '#f44336', // Default red color
          transition: 'background-color 0.3s ease-in-out', // Smooth transition
          '&:hover': {
            backgroundColor: '#e53935', // Slightly darker red when hovered
          }
        }}
      >
        Log Out
      </Button>
      <LogoutPopup open={open} onClose={() => setOpen(false)} onLogout={handleLogout} />
    </>
  );
};

export default LogoutButtonWithPopup;
