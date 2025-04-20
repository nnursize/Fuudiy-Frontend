// components/ConnectionModal.jsx
import React from "react";
import { Box, Modal, Typography, Stack, Chip, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

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
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Connections</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Box>
        {usernames.length === 0 ? (
          <Typography variant="body2" color="textSecondary">No connections yet.</Typography>
        ) : (
          <Stack spacing={1}>
            {usernames.map((username, index) => (
              <Chip key={index} label={username} variant="outlined" />
            ))}
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default ConnectionModal;
