import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Divider, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
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
  height: '860px',
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

const StyledButton = styled(Button)({
  backgroundColor: '#1976d2',
  color: 'white',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
});

const SaveButton = styled(Button)({
  backgroundColor: '#1976d2',
  color: 'white',
  marginTop: '1rem',
  width: '50%',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
});

const InputField = styled(TextField)({
  marginTop: '1rem',
  marginBottom: '1rem',
  width: '50%',
});

const MyProfileModifyPage = () => {
  const [orderCompletion, setOrderCompletion] = useState('one');

  const handleRadioChange = (e) => {
    setOrderCompletion(e.target.value);
  };

  return (
    <Container>
      <FormContainer>
        <ServiceName>자리부터Java</ServiceName>
        <Header>
          <Typography variant="h6" component="h2">
            My Profile Modify
          </Typography>
          <ButtonsBox>
            <StyledButton variant="contained">My Home</StyledButton>
            <StyledButton variant="contained">Log-out</StyledButton>
          </ButtonsBox>
        </Header>
        <Divider sx={{ width: '100%', marginBottom: '2rem' }} />

        <InputField
          label="아이디"
          variant="outlined"
          name="id"
          value="user_id"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '50%', marginBottom: '1rem' }}
        >
          아이디 중복 검사
        </Button>

        <InputField
          label="이메일"
          variant="outlined"
          name="email"
          value="user_email@example.com"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '50%', marginBottom: '1rem' }}
        >
          이메일 확인
        </Button>

        <InputField
          label="비밀번호"
          type="password"
          variant="outlined"
          name="password"
          value=""
        />
        <InputField
          label="비밀번호 확인"
          type="password"
          variant="outlined"
          name="confirmPassword"
          value=""
        />
        <InputField
          label="판매자 이름"
          variant="outlined"
          name="username"
          value="user_name"
        />

        <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
          <TextField
            label="전화번호"
            variant="outlined"
            name="phone"
            value="010-1234-5678"
            sx={{ marginRight: '0.5rem', flexGrow: 1 }}
          />
          <Button
            variant="contained"
            sx={{ height: '56px' }}
          >
            확인
          </Button>
        </Box>

        <FormControl component="fieldset" sx={{ marginTop: '1rem' }}>
          <RadioGroup
            aria-label="ordercompletion"
            name="orderCompletion"
            value={orderCompletion}
            onChange={handleRadioChange}
            row
          >
            <FormControlLabel
              value="one"
              control={<Radio color="primary" />}
              label="한번 클릭 시 주문 완료 처리"
            />
            <FormControlLabel
              value="two"
              control={<Radio color="primary" />}
              label="두번 클릭 시 주문 완료 처리"
            />
          </RadioGroup>
        </FormControl>

        <SaveButton variant="contained">
          Save
        </SaveButton>

        <Link to="/profile" style={{ textDecoration: 'none', marginTop: '1rem', color: '#1976d2' }}>
          뒤로가기
        </Link>
      </FormContainer>
    </Container>
  );
};

export default MyProfileModifyPage;