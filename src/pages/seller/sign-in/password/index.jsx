import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { resetPassword } from '../../../../apis/auth/AuthAPI';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '9rem',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    marginTop: '5rem',
    padding: '1rem',
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  width: '30%', 
  padding: '2rem',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: '1rem',
  },
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '1.5rem',
}));

const PasswordPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  console.log(isMobile);

  const [values, setValues] = useState({
    loginId: '',
    email: '',
    mobile: '',
  });

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'mobile') {
      const formattedValue = formatPhoneNumber(value);
      setValues({
        ...values,
        [id]: formattedValue,
      });
    } else {
      setValues({
        ...values,
        [id]: value,
      });
    }
  };

  const handlePhoneKeyDown = (e) => {
    const { key } = e;
    const { value } = e.target;
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length >= 11 && key !== 'Backspace' && key !== 'Delete') {
      e.preventDefault();
    }
  };

  const handleSubmit = async () => {
    const { loginId, email, mobile } = values;

    if (!loginId || !email || !mobile) {
      alert('모든 정보를 입력해야 합니다.');
      return;
    }

    try {
      const response = await resetPassword(values);
      alert(response);
      navigate('/login');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Typography variant="h5" component="h1" gutterBottom sx={{ marginBottom: '2rem' }}>
          비밀번호 찾기
        </Typography>
        <CustomTextField 
          id="loginId" 
          label="아이디" 
          variant="outlined" 
          fullWidth 
          onChange={handleChange} 
          value={values.loginId} 
        />
        <CustomTextField 
          id="email" 
          label="이메일" 
          variant="outlined" 
          fullWidth 
          onChange={handleChange} 
          value={values.email} 
        />
        <CustomTextField 
          id="mobile" 
          label="전화번호" 
          variant="outlined" 
          fullWidth 
          onChange={handleChange}
          onKeyDown={handlePhoneKeyDown} 
          value={values.mobile} 
        />
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleSubmit}
        >
          확인
        </Button>
        <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', marginTop: '1rem', textAlign: 'center' }}>
          뒤로가기
        </Link>
      </FormContainer>
    </Container>
  );
};

export default PasswordPage;