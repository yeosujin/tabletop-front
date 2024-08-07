import axios from 'axios'

const EMAIL_VALIDATION_API_KEY = process.env.REACT_APP_EMAIL_VALIDATION_API_KEY
const PHONE_VALIDATION_API_KEY = process.env.REACT_APP_PHONE_VALIDATION_API_KEY

export const AuthApi = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const EmailApi = axios.create({
    baseURL: `https://emailvalidation.abstractapi.com/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const PhoneApi = axios.create({
    baseURL: `https://phonevalidation.abstractapi.com/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 로그인 요청
export const login = async (loginRequest) => {
    const response = await AuthApi.post(`/api/auth/login`, loginRequest)
    return response.data
}

// 로그아웃 요청
export const logout = async (loginId) => {
    const response = await AuthApi.post(`/api/auth/${loginId}`)
    return response.data
}

// 아이디 중복 체크
export const checkLoginId = async (loginId) => {
    const response = await AuthApi.get(`/api/sellers/exists`, {
        params: { loginId: loginId },
    })
    return response.data
}

// 이메일 포멧팅 유효성
export const validateEmail = async (email) => {
    const response = await EmailApi.get(`/`, {
        params: {
            api_key: EMAIL_VALIDATION_API_KEY,
            email: email,
        },
    })
    return response.data
}

// 전화번호 유효성
export const validatePhone = async (phone) => {
    const response = await PhoneApi.get(`/`, {
        params: {
            api_key: PHONE_VALIDATION_API_KEY,
            country: 'KR', // 지역 설정을 같이 파라미터로 보내야지만 요청이 정상 처리 (해외는 고려안하는 부분이니.. 한국에서만 서비스 처리)
            phone: phone,
        },
    })
    return response.data
}

// 이메일 인증
export const sendVerificationCode = async (email) => {
    const response = await AuthApi.post(
        `/api/mail/sendVerificationCode`,
        null,
        {
            params: { email: email },
        }
    )
    return response.data
}

// 비밀번호 재설정 요청
export const resetPassword = async (passwordResetRequest) => {
    const response = await AuthApi.post(
        `/api/mail/temporaryPwd`,
        passwordResetRequest
    )
    return response.data
}
