import React, { useState } from 'react';
import { Dialog, DialogTitle, Box, Avatar } from '@mui/material';

const ProfilePictureSelector = ({ currentAvatar, onSelect }) => {
  const avatarOptions = [
    'food1.png', 'food2.png', 'food3.png', 'food4.png',
    'food5.png', 'food6.png', 'food7.png', 'food8.png'
  ];
  
  const [open, setOpen] = useState(false);

  // Ensure correct file path format for the avatar
  const getAvatarSrc = (avatarId) => {
    return avatarId.includes('.png') ? `/avatars/${avatarId}` : `/avatars/${avatarId}.png`;
  };

  const handleSelect = (avatarId) => {
    onSelect(avatarId.replace('.png', '')); // Store avatarId without .png
    setOpen(false);
  };

  return (
    <>
      {/* Ensure Avatar displays correctly on first render */}
      <Avatar
        src={getAvatarSrc(currentAvatar)}
        alt="Profile Picture"
        sx={{ width: 100, height: 100, cursor: 'pointer' }}
        onClick={() => setOpen(true)}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select Profile Picture</DialogTitle>
        <Box display="flex" flexWrap="wrap" padding={2} gap={2}>
          {avatarOptions.map((avatar) => (
            <Avatar
              key={avatar}
              src={`/avatars/${avatar}`}
              alt={avatar}
              sx={{ width: 80, height: 80, cursor: 'pointer' }}
              onClick={() => handleSelect(avatar)}
            />
          ))}
        </Box>
      </Dialog>
    </>
  );
};

export default ProfilePictureSelector;
