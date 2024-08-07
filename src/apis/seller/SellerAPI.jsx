import axios from 'axios'

export const getTokenHeaders = () => {
    const TOKEN_TYPE = localStorage.getItem('tokenType')
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    let REFRESH_TOKEN = localStorage.getItem('refreshToken')

    return {
        Authorization: `${TOKEN_TYPE} ${ACCESS_TOKEN}`,
        REFRESH_TOKEN: REFRESH_TOKEN,
    }
}

export const SellerApi = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
})

const refreshAccessToken = async () => {
    try {
        const response = await SellerApi.post(`/api/auth/token/refresh`, null, {
            headers: getTokenHeaders(),
        })
        const ACCESS_TOKEN = response.data
        localStorage.setItem('accessToken', ACCESS_TOKEN)
    } catch (err) {
        if (err.response && err.response.status === 401) {
            // 리프레시 토큰이 만료된 경우 로그인 페이지로 이동
            alert(err.response.data.message)
            localStorage.clear()
            window.location.href = '/login' // 로그인 페이지로 리디렉션
        }
    }
}

SellerApi.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true
            await refreshAccessToken()
            // 새로운 토큰으로 Authorization 헤더를 업데이트한 후 다시 요청
            originalRequest.headers['Authorization'] =
                `${localStorage.getItem('tokenType')} ${localStorage.getItem('accessToken')}`
            return SellerApi(originalRequest)
        }

        return Promise.reject(error)
    }
)

// 회원가입
export const signUp = async ({
    loginId,
    email,
    password,
    username,
    mobile,
}) => {
    const data = { loginId, email, password, username, mobile }
    const response = await SellerApi.post(`/api/sellers/signup`, data)
    return response.data
}

// 판매자 정보 조회
export const getSellerInfo = async (loginId) => {
    const response = await SellerApi.get(`/api/sellers/${loginId}`, {
        headers: getTokenHeaders(),
    })
    return response.data
}

// 판매자 정보 수정
export const updateSellerInfo = async (loginId, sellerDto) => {
    const response = await SellerApi.put(`/api/sellers/${loginId}`, sellerDto, {
        headers: getTokenHeaders(),
    })
    return response.data
}

// 판매자 탈퇴
export const deleteSeller = async (loginId) => {
    const response = await SellerApi.delete(`/api/sellers/${loginId}`, {
        headers: getTokenHeaders(),
    })
    return response
}

// 사업자등록번호 중복 검사
export const isDuplicatedAPI = async (num) => {
    const response = await SellerApi.get(`/api/duplicationCheck/${num}`, {
        headers: getTokenHeaders(),
    })
    return response.data
}

// 가게 목록 조회
export const getStoresAPI = async (loginId) => {
    const response = await SellerApi.get(`/api/stores/${loginId}`, {
        headers: getTokenHeaders(),
    })
    return response.data
}

// 가게 등록
export const addStoreAPI = async (loginId, data) => {
    const response = await SellerApi.post(`/api/store/${loginId}`, data, {
        headers: getTokenHeaders(),
    })
    return response.data
}

// 가게 상세 조회
export const getStoreDetailsAPI = async (storeId) => {
    const response = await SellerApi.get(`/api/stores/${storeId}/details`, {
        headers: getTokenHeaders(),
    })
    return response.data
}

// 가게 수정
export const modifyStoreAPI = async (storeId, data) => {
    const response = await SellerApi.put(`/api/stores/${storeId}`, data, {
        headers: getTokenHeaders(),
    })
    return response.data
}

// 가게 삭제
export const deleteStoreAPI = async (storeId) => {
    const response = await SellerApi.delete(`/api/stores/${storeId}`, {
        headers: getTokenHeaders(),
    })
    return response.data
}
