import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { getSellerInfo, deleteSeller } from '../../../apis/seller/SellerAPI';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '2rem',
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
  alignItems: 'center',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  width: '50%',
  padding: '1.8rem',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: '1rem',
  },
}));

const Header = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '1rem',
}));

const MyProfileText = styled(Typography)(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center',
}));

const ModifyButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: 'white',
  marginTop: '1.5rem',
  width: '10%',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#9C27B0',
  color: 'white',
  marginTop: '1.5rem',
  width: '10%',
  '&:hover': {
    backgroundColor: '#7B1FA2',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const ReadOnlyInputField = styled(TextField)(({ theme }) => ({
  marginTop: '1.5rem',
  marginBottom: '0.5rem',
  width: '50%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const ReadOnlyRadio = styled(Radio)({
  '&.Mui-disabled': {
    color: 'rgba(0, 0, 0, 0.26)',
  },
});

const ClickSettingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginTop: '1rem',
}));

const MyProfilePage = () => {
  const { loginId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  console.log(isMobile);

  const [seller, setSeller] = useState({
    loginId: '',
    username: '',
    email: '',
    mobile: '',
    doneClickCountSetting: null,
  });

  useEffect(() => {
    getSellerInfo(loginId)
      .then((data) => {
        setSeller(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [loginId]);

  const handleModifyClick = () => {
    navigate(`/sellers/${loginId}/profile/modify`, { state: { seller } });
  };

  const handleDeleteClick = async () => {
    try {
      const response = await deleteSeller(loginId);
      if (response.status === 204) {
        localStorage.removeItem('id');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        alert('판매자 계정이 성공적으로 삭제되었습니다.');
        navigate('/login');
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Header>
          <MyProfileText variant="h6">My Profile</MyProfileText>
        </Header>

        <Divider sx={{ width: '100%', marginBottom: '4rem' }} />

        <ReadOnlyInputField
          label="아이디"
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          value={seller.loginId}
        />
        <ReadOnlyInputField
          label="이름"
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          value={seller.username}
        />
        <ReadOnlyInputField
          label="이메일"
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          value={seller.email}
        />
        <ReadOnlyInputField
          label="전화번호"
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          value={seller.mobile}
        />

        <ClickSettingBox>
          <RadioGroup row>
            <FormControlLabel
              value="false"
              control={<ReadOnlyRadio color="primary" checked={seller.doneClickCountSetting === false} disabled />}
              label="한번 클릭 시 주문 완료 처리"
            />
            <FormControlLabel
              value="true"
              control={<ReadOnlyRadio color="primary" checked={seller.doneClickCountSetting === true} disabled />}
              label="두번 클릭 시 주문 완료 처리"
            />
          </RadioGroup>
        </ClickSettingBox>

        <ModifyButton variant="contained" fullWidth onClick={handleModifyClick}>
          Modify
        </ModifyButton>

        <DeleteButton variant="contained" fullWidth onClick={handleDeleteClick}>
          탈퇴하기
        </DeleteButton>
      </FormContainer>
    </Container>
  );
};

export default MyProfilePage;