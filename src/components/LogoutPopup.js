import React from 'react';
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("global");

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
        {t("confirmLogout")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="logout-dialog-description"
          sx={{ color: theme.palette.text.secondary }}
        >
          {t("confirmLogoutMessage")}
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
            {t("cancel")}
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
            {t("logout")}
        </Button>
        </DialogActions>
    </Dialog>
  );
};

export default LogoutPopup;
