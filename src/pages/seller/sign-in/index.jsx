import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../../apis/auth/AuthAPI'

const Container = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
})

const FormContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    width: '60%',
    padding: '2rem',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
})

const LogoBox = styled(Box)({
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #e0e0e0',
})

const FormBox = styled(Box)({
    width: '50%',
    padding: '0 2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
})

const SignInPage = () => {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        loginId: '',
        password: '',
    })

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.id]: e.target.value,
        })
    }

    const handleSubmit = async () => {
        const { loginId, password } = values

        if (!loginId || !password) {
            alert('아이디와 비밀번호 모두 입력해주세요.')
            return
        }

        try {
            const response = await login(values)

            localStorage.clear()

            localStorage.setItem('id', response.id)
            localStorage.setItem('tokenType', response.tokenType)
            localStorage.setItem('accessToken', response.accessToken)
            localStorage.setItem('refreshToken', response.refreshToken)

            const loginId = localStorage.getItem('id')
            navigate(`/storelist`)
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

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
                    <TextField
                        id="loginId"
                        label="ID"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        onChange={handleChange}
                        value={values.loginId}
                        onKeyDown={handleKeyDown}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        onChange={handleChange}
                        value={values.password}
                        onKeyDown={handleKeyDown}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '1rem',
                        }}
                    >
                        <Link
                            to="/signup"
                            style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                            회원가입
                        </Link>
                        <Link
                            to="/password"
                            style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                            비밀번호 찾기
                        </Link>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: '2rem' }}
                        onClick={handleSubmit}
                    >
                        로그인
                    </Button>
                </FormBox>
            </FormContainer>
        </Container>
    )
}

export default SignInPage
