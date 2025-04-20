// components/ConnectionModal.jsx
import React from "react";
import { Box, Modal, Typography, Stack, Chip, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ Import useTranslation

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 320,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  outline: 'none'
};

const ConnectionModal = ({ open, onClose, usernames }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("global"); // ✅ Hook into translation context

  const handleClick = (username) => {
    navigate(`/profile/${username}`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{t("connectionsList")}</Typography> {/* ✅ Translated */}
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Box>
        {usernames.length === 0 ? (
          <Typography variant="body2" color="textSecondary">{t("noConnectionsYet")}</Typography> // ✅ Translated
        ) : (
          <Stack spacing={1}>
            {usernames.map((username, index) => (
              <Chip
                key={index}
                label={username}
                variant="outlined"
                onClick={() => handleClick(username)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default ConnectionModal;
