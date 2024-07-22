import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { signUp, validateEmail, validatePhone } from '../../../apis/auth/AuthAPI';

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

const SignUpPage = () => {
  const [emailValid, setEmailValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState({
    id: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phone: '',
  });

  // setError(''); -> 에러 메시지를 초기화
  // - 사용자가 비밀번호를 입력한 후 비밀번호 확인 입력 필드로 이동하여 올바른 비밀번호를 입력했을 때, 이전에 설정된 에러 메시지를 지워주는 역할 
  // - 사용자가 에러를 수정했을 때, 화면에 에러 메시지가 계속 남아 있지 않도록 하는 것
  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'password' || name === 'confirmPassword') && value.length > 20) {
      setError('비밀번호는 최대 20자까지 입력할 수 있습니다.');
    } else {
      setError('');
    }
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // formValues.password !== formValues.confirmPassword -> 비밀번호 확인 입력을 먼저 입력 하는 경우 에러 용도
  const handleBlur = (e) => {
    if (formValues.password && formValues.confirmPassword && formValues.password !== formValues.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
    } else {
      setError('');
    }
  };

  const handleEmailValidation = async () => {
    try {
      const response = await validateEmail(formValues.email);
      const { is_valid_format, is_smtp_valid } = response;
  
      if (is_valid_format.value && is_smtp_valid.value) {
        alert('이메일이 유효합니다.');
        setEmailValid(true);
      } else if (!is_valid_format.value && !is_smtp_valid.value) {
        alert('입력하신 이메일 주소가 유효하지 않습니다. 올바른 이메일을 입력해주세요.');
        setEmailValid(false);
      } else if (is_valid_format.value && !is_smtp_valid.value) {
        // 추후 이메일 인증 절차를 구현할 수 있도록 이메일 유효성 검증 성공으로 처리하지 않음(이메일 인증 구현 시 사용)
        alert('이메일 형식은 맞으나 인증된 이메일이 아닙니다. 이메일 인증이 필요합니다.');
        setEmailValid(false);
      }
    } catch (err) {
      console.error('이메일 검증 실패:', err);
      alert('이메일 검증 중 오류가 발생했습니다.');
      setEmailValid(false);
    }
  };

  const handlePhoneValidation = async () => {
    try {
      const response = await validatePhone(formValues.phone);
      const { valid } = response;

      if (valid) {
        alert('휴대폰 번호가 유효합니다.');
        setPhoneValid(true);
      } else {
        alert('입력하신 휴대폰 번호가 유효하지 않습니다. 올바른 휴대폰 번호를 입력해주세요.');
        setPhoneValid(false);
      }
    } catch (err) {
      console.error('휴대폰 번호 검증 실패:', err);
      alert('휴대폰 번호 검증 중 오류가 발생했습니다.');
      setPhoneValid(false);
    }
  };

  const validateForm = () => {
    const { id, email, password, confirmPassword, username, phone } = formValues;

    if (!id || !email || !password || !confirmPassword || !username || !phone) {
      alert('모든 정보를 입력해야 합니다.');
      return false;
    }

    if (!emailValid) {
      alert('이메일 확인 검증을 완료해야 합니다.');
      return false;
    }

    if (!phoneValid) {
      alert('휴대폰 전화번호 유효성 검증을 완료해야 합니다.');
      return false;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { id, email, password, username, phone } = formValues;

    try {
      const response = await signUp({ id, email, password, username, phone });
      console.log('회원가입 성공:', response);
      alert('회원가입 성공!');
      // 회원가입 성공 시 처리 로직 추가
    } catch (err) {
      console.error('회원가입 실패:', err);
      alert('회원가입에 실패했습니다.');
    }
  };

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
            회원가입
          </Typography>
          <TextField
            label="아이디"
            variant="outlined"
            margin="normal"
            fullWidth
            name="id"
            value={formValues.id}
            onChange={handleChange}
          />
          <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '0.5rem' }}>
            아이디 중복 검사
          </Button>
          <TextField
            label="이메일"
            variant="outlined"
            margin="normal"
            fullWidth
            name="email"
            value={formValues.email}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: '0.5rem' }}
            onClick={handleEmailValidation}
          >
            이메일 확인
          </Button>
          <TextField
            label="비밀번호"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            value={formValues.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <TextField
            label="비밀번호 확인"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="판매자 이름"
            variant="outlined"
            margin="normal"
            fullWidth
            name="username"
            value={formValues.username}
            onChange={handleChange}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="전화번호"
              variant="outlined"
              fullWidth
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
            />
            <Button variant="contained" sx={{ marginLeft: '0.5rem' }} onClick={handlePhoneValidation}>
              확인
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: '1rem' }}
            onClick={handleSignUp}
          >
            회원가입
          </Button>
          <Link to="/signin" style={{ textDecoration: 'none', color: '#1976d2', marginTop: '1rem', textAlign: 'center' }}>
            뒤로가기
          </Link>
        </FormBox>
      </FormContainer>
    </Container>
  );
};

export default SignUpPage;