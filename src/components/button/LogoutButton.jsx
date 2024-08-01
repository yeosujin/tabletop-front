import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../apis/auth/AuthAPI';

const LogoutButton = ({ loginId }) => {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      const response = await logout(loginId);
      if (response === "로그아웃 되었습니다.") {
        localStorage.removeItem('id');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        alert(response);
        navigate('/signin'); // 로그아웃 후 로그인 페이지로 이동
      }
    } catch (err) {
      alert('로그아웃에 실패했습니다.');
      console.log(err);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleLogoutClick}>
      Log-out
    </Button>
  );
};

export default LogoutButton;