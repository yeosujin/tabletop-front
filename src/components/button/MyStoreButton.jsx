import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MyStoreButton = ({ loginId }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(`/stores/${loginId}`);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleHomeClick}>
      My Store
    </Button>
  );
};

export default MyStoreButton;