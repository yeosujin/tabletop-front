import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Divider, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { styled } from '@mui/system';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { validateEmail, sendVerificationCode, validatePhone } from '../../../../apis/auth/AuthAPI';
import { updateSellerInfo } from '../../../../apis/seller/SellerAPI.jsx';

const Container = styled(Box)({
  display: 'flex',
  height: '89vh',
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
  height: '91%',
  padding: '1.8rem',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
});

const Header = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '1rem',
});

const MyProfileModfiyText = styled(Typography)({
  fontSize: '32px', // Adjusted to h1 size
  fontWeight: 'bold',
  textAlign: 'center', // Center align the text
});

const SaveButton = styled(Button)({
  backgroundColor: '#1976d2',
  color: 'white',
  marginTop: '1.5rem',
  width: '10%',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
});

const InputField = styled(TextField)({
  marginTop: '1rem',
  marginBottom: '1rem',
  width: '50%',
});

const ErrorMessage = styled(Typography)({
  color: 'red',
  marginTop: '1.5rem',
});

const MyProfileModifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { seller } = location.state;
  const loginId = localStorage.getItem('id');

  const [orderCompletion, setOrderCompletion] = useState(seller.doneClickCountSetting ? 'true' : 'false');
  const [formValues, setFormValues] = useState({
    loginId: seller.loginId,
    email: seller.email,
    password: '',
    confirmPassword: '',
    username: seller.username,
    mobile: seller.mobile,
  });
  const [error, setError] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [serverVerificationCode, setServerVerificationCode] = useState('');
  const [phoneValid, setPhoneValid] = useState(true);

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
  };

  const handleRadioChange = (e) => {
    setOrderCompletion(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password' || name === 'confirmPassword') {
      if (!value) {
        setError('');
      } else if (value.length > 20) {
        setError('비밀번호는 최대 20자까지 입력할 수 있습니다.');
      } else if (value.length < 8) {
        setError('비밀번호는 최소 8자 이상이어야 합니다.');
      } else if (name === 'confirmPassword' && formValues.password && formValues.password !== value) {
        setError('비밀번호가 일치하지 않습니다.');
      } else {
        setError('');
      }
    } else if (name === 'username' && value.length > 0 && value.length < 2) {
      setError('판매자 이름은 최소 2자 이상이어야 합니다.');
    } else if (name === 'mobile') {
      const formattedValue = formatPhoneNumber(value);
      setFormValues({
        ...formValues,
        [name]: formattedValue,
      });
      return;
    } else {
      setError('');
    }

    setFormValues({
      ...formValues,
      [name]: value,
    });

    // 이메일 변경 시 유효성 초기화
    if (name === 'email') {
      setEmailValid(value === seller.email);
      setVerificationSent(false);
    }

    // 전화번호 변경 시 유효성 초기화
    if (name === 'mobile') {
      setPhoneValid(value === seller.mobile);
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

  const handleBlur = (e) => {
    const { name } = e.target;

    if (name === 'password' || name === 'confirmPassword') {
      if (formValues.password || formValues.confirmPassword) {
        if (formValues.password.length < 8) {
          setError('비밀번호는 최소 8자 이상이어야 합니다.');
        } else if (formValues.password.length > 20) {
          setError('비밀번호는 최대 20자까지 입력할 수 있습니다.');
        } else if (formValues.password && formValues.confirmPassword && formValues.password !== formValues.confirmPassword) {
          setError('비밀번호가 일치하지 않습니다.');
        } else {
          setError('');
        }
      }
    } else if (name === 'username' && formValues.username.length > 0 && formValues.username.length < 2) {
      setError('판매자 이름은 최소 2자 이상이어야 합니다.');
    } else {
      setError('');
    }
  };

  const validateForm = () => {
    const { email, password, confirmPassword, username, mobile } = formValues;

    if (!email || !username || !mobile) {
      setError('모든 정보를 입력해야 합니다.');
      return false;
    }

    if (!emailValid) {
      setError('이메일 확인 검증을 완료해야 합니다.');
      return false;
    }

    if (!phoneValid) {
      setError('휴대폰 전화번호 유효성 검증을 완료해야 합니다.');
      return false;
    }

    if (password && (password.length < 8 || password.length > 20)) {
      setError('비밀번호는 최소 8자 이상, 최대 20자 이하이어야 합니다.');
      return false;
    }

    if (password && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { email, password, username, mobile } = formValues;
    const updatedData = {
      email,
      username,
      mobile,
      doneClickCountSetting: orderCompletion === 'true'
    };

    if (password) {
      updatedData.password = password;
    }

    try {
      const response = await updateSellerInfo(formValues.loginId, updatedData);
      console.log(response);
      alert('프로필이 성공적으로 수정되었습니다.');
      navigate(`/sellers/${loginId}/profile`);
    } catch (err) {
      alert(err.response.data.message);
      setFormValues({
        ...formValues,
        password: '',
        confirmPassword: ''
      });
    }
  };

  const handleEmailValidation = async () => {
    try {
      const response = await validateEmail(formValues.email);
      const { is_valid_format, is_smtp_valid } = response;

      if (is_valid_format.value && is_smtp_valid.value) {
        alert('이메일이 유효합니다.');
        sendVerificationCodeToEmail();
      } else if (!is_valid_format.value && !is_smtp_valid.value) {
        alert('입력하신 이메일 주소가 유효하지 않습니다. 올바른 이메일을 입력해주세요.');
        setEmailValid(false);
      } else if (is_valid_format.value && !is_smtp_valid.value) {
        alert('이메일 형식은 맞으나 인증된 이메일이 아닙니다. 이메일 인증이 필요합니다.');
        sendVerificationCodeToEmail();
      }
    } catch (err) {
      console.error('이메일 검증 실패:', err);
      alert('이메일 검증 중 오류가 발생했습니다.');
      setEmailValid(false);
    }
  };

  const sendVerificationCodeToEmail = async () => {
    try {
      const response = await sendVerificationCode(formValues.email);
      if (response) {
        alert('이메일로 인증 코드가 전송되었습니다.');
        setServerVerificationCode(response); // 서버에서 보낸 인증 코드 저장
        setVerificationSent(true); // 인증 코드 전송 상태를 true로 설정
      } else {
        alert('인증 코드 전송에 실패했습니다.');
      }
    } catch (err) {
      console.error('인증 코드 전송 실패:', err);
      alert('인증 코드 전송 중 오류가 발생했습니다.');
    }
  };

  const handlePhoneValidation = async () => {
    try {
      const response = await validatePhone(formValues.mobile);
      const { valid } = response;

      if (valid) {
        alert('휴대폰 번호가 유효합니다.');
        setPhoneValid(true);
        setError('');
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

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleVerificationCodeSubmit = () => {
    if (verificationCode === serverVerificationCode) {
      alert('이메일 인증이 완료되었습니다.');
      setEmailValid(true);
      setError('');
    } else {
      alert('인증 코드가 일치하지 않습니다. 다시 확인해주세요.');
      setEmailValid(false);
    }
  };

  return (
    <Container>
      <FormContainer>

        <Header>
            <MyProfileModfiyText variant="h6">My Profile Modify</MyProfileModfiyText>
        </Header>

        <Divider sx={{ width: '100%', marginBottom: '2rem' }} />

        <InputField
          label="아이디"
          variant="outlined"
          name="loginId"
          value={formValues.loginId}
          InputProps={{
            readOnly: true,
            style: { backgroundColor: '#f0f0f0' },
          }}
        />

        <InputField
          label="이메일"
          variant="outlined"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '50%', marginBottom: '1rem' }}
          onClick={handleEmailValidation}
          disabled={!formValues.email || formValues.email === seller.email}
        >
          이메일 확인
        </Button>
        {verificationSent && (
          <Box mt={2}>
            <TextField
              label="인증 코드 입력"
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={handleVerificationCodeChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: '0.5rem' }}
              onClick={handleVerificationCodeSubmit}
            >
              인증 코드 확인
            </Button>
          </Box>
        )}

        <InputField
          label="비밀번호"
          type="password"
          variant="outlined"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <InputField
          label="비밀번호 확인"
          type="password"
          variant="outlined"
          name="confirmPassword"
          value={formValues.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <InputField
          label="이름"
          variant="outlined"
          name="username"
          value={formValues.username}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', marginTop: '1rem' }}>
          <TextField
            label="전화번호"
            variant="outlined"
            name="mobile"
            value={formValues.mobile}
            onChange={handleChange}
            onKeyDown={handlePhoneKeyDown}
            sx={{ marginRight: '0.5rem', flexGrow: 1 }}
          />
          <Button
            variant="contained"
            sx={{ height: '56px' }}
            onClick={handlePhoneValidation}
            disabled={!formValues.mobile || formValues.mobile === seller.mobile}
          >
            확인
          </Button>
        </Box>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormControl component="fieldset" sx={{ marginTop: '1.5rem' }}>
          <RadioGroup
            aria-label="ordercompletion"
            name="orderCompletion"
            value={orderCompletion}
            onChange={handleRadioChange}
            row
          >
            <FormControlLabel
              value="false"
              control={<Radio color="primary" />}
              label="한번 클릭 시 주문 완료 처리"
            />
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="두번 클릭 시 주문 완료 처리"
            />
          </RadioGroup>
        </FormControl>

        <SaveButton variant="contained" onClick={handleSave}>
          Save
        </SaveButton>

        <Link to={`/sellers/${loginId}/profile`} style={{ textDecoration: 'none', marginTop: '1rem', color: '#1976d2', marginTop: '1.5rem' }}>
          뒤로가기
        </Link>
      </FormContainer>
    </Container>
  );
};

export default MyProfileModifyPage;