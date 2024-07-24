import React from 'react';
import { Box, Button, TextField, Typography, Divider } from '@mui/material';
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
  flexDirection: 'column',
  alignItems: 'center',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  width: '60%',
  padding: '1.8rem',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
});

const Header = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
});

const ServiceName = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '1rem',
});

const ButtonsBox = styled(Box)({
  display: 'flex',
  gap: '1rem',
});

const ModifyButton = styled(Button)({
  backgroundColor: '#1976d2',
  color: 'white',
  marginTop: '1rem',
  width: '50%',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
});

const ReadOnlyInputField = styled(TextField)({
  marginTop: '1rem',
  marginBottom: '1rem',
  width: '50%',
});

const MyProfilePage = () => {
  return (
    <Container>
      <FormContainer>
        <ServiceName>자리부터Java</ServiceName>
        
        <Header>
          <Typography variant="h6" component="h2">
            My Profile
          </Typography>
          <ButtonsBox>
            <Button variant="contained" color="primary">My Home</Button>
            <Button variant="contained" color="primary">Log-out</Button>
          </ButtonsBox>
        </Header>

        <Divider sx={{ width: '100%', marginBottom: '2rem' }} />
        
        <ReadOnlyInputField
          label="ID"
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          value="user_id"
        />
        <ReadOnlyInputField
          label="이름"
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          value="user_name"
        />
        <ReadOnlyInputField
          label="전화번호"
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          value="010-1234-5678"
        />

        <ModifyButton variant="contained" fullWidth>
          Modify
        </ModifyButton>

        <Link to="/withdrawal" style={{ textDecoration: 'none', marginTop: '1rem', color: '#1976d2' }}>
          탈퇴하기
        </Link>
        
      </FormContainer>
    </Container>
  );
};

export default MyProfilePage;