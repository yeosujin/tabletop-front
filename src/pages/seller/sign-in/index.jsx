import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const Container = styled(Box)({
  display: 'flex',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
});

const FormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  width: '60%',
  padding: '2rem',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
});

const LogoBox = styled(Box)({
  width: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid #e0e0e0',
});

const FormBox = styled(Box)({
  width: '50%',
  padding: '0 2rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const SignInPage = () => {
  return (
    <Container>
      <FormContainer>
        <LogoBox>
          <Box
            sx={{
              width: '200px',
              height: '200px',
              backgroundColor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            logo image
          </Box>
        </LogoBox>
        <FormBox>
          <Typography variant="h5" component="h1" gutterBottom>
            로그인
          </Typography>
          <TextField label="ID" variant="outlined" margin="normal" fullWidth />
          <TextField label="Password" type="password" variant="outlined" margin="normal" fullWidth />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>회원가입</Link>
          </Box>
          <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '2rem' }}>
            로그인
          </Button>
        </FormBox>
      </FormContainer>
    </Container>
  );
};

export default SignInPage;