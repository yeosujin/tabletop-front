import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../../../apis/auth/AuthAPI';

const Container = styled(Box)({
  display: 'flex',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
});

const FormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  width: '30%', 
  padding: '2rem',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
});

const CustomTextField = styled(TextField)({
  marginBottom: '1.5rem', 
});

const PasswordPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    loginId: '',
    email: '',
    mobile: '',
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
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
          value={values.mobile} 
        />
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ marginTop: '1rem', backgroundColor: '#00C73C' }}
          onClick={handleSubmit}
        >
          확인
        </Button>
      </FormContainer>
    </Container>
  );
};

export default PasswordPage;