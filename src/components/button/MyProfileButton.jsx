import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MyProfileButton = ({ loginId }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${loginId}`);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleProfileClick}>
      My Profile
    </Button>
  );
};

export default MyProfileButton;