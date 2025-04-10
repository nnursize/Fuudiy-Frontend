// LoginPopup.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const LoginPopup = ({ open, onClose, onLogin }) => {
  const theme = useTheme();
  const { t } = useTranslation("global");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="login-dialog-title"
      aria-describedby="login-dialog-description"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.default,
          padding: 2,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle id="login-dialog-title" sx={{ color: theme.palette.text.primary }}>
        {t("loginRequired")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="login-dialog-description"
          sx={{ color: theme.palette.text.secondary }}
        >
          {t("pleaseLoginToComment")}
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
            },
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={onLogin}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.error.main,
            },
          }}
        >
          {t("login")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginPopup;
