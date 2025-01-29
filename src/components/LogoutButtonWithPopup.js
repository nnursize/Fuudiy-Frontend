import React, { useState } from 'react';
import { Button } from '@mui/material';
import LogoutPopup from './LogoutPopup';

const LogoutButtonWithPopup = () => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    console.log('User logged out'); // Replace with your logout logic
    // For example, clear session data or redirect:
    // localStorage.removeItem('authToken');
    // window.location.href = '/login';
    setOpen(false); // Close the popup after logout
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => setOpen(true)}
        sx={{ marginTop: 2 }}
      >
        Log Out
      </Button>
      <LogoutPopup open={open} onClose={() => setOpen(false)} onLogout={handleLogout} />
    </>
  );
};

export default LogoutButtonWithPopup;
