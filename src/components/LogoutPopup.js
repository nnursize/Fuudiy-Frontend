import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useTheme,
} from '@mui/material';

const LogoutPopup = ({ open, onClose, onLogout }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.default,
          padding: 2,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle id="logout-dialog-title" sx={{ color: theme.palette.text.primary }}>
        Confirm Logout
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="logout-dialog-description"
          sx={{ color: theme.palette.text.secondary }}
        >
          Are you sure you want to log out of the website?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: theme.palette.action.selected,
            }}}
          >
            Cancel
        </Button>
        <Button
            onClick={onLogout}
            sx={{
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.error.main,
              },
            }}
            variant="contained"
        >
            Log Out
        </Button>
        </DialogActions>
    </Dialog>
  );
};

export default LogoutPopup;
