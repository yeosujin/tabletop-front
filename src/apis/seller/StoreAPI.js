import axios from 'axios'
import { StoreAPI } from './StoreAPI'

const getTokenHeaders = () => {
    const TOKEN_TYPE = localStorage.getItem('tokenType')
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    let REFRESH_TOKEN = localStorage.getItem('refreshToken')

    return {
        Authorization: `${TOKEN_TYPE} ${ACCESS_TOKEN}`,
        REFRESH_TOKEN: REFRESH_TOKEN,
    }
}

export const StoreAPI = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
})

const refreshAccessToken = async () => {
    try {
        const response = await StoreAPI.post(`/api/auth/token/refresh`, null, {
            headers: getTokenHeaders(),
        })
        const ACCESS_TOKEN = response.data
        localStorage.setItem('accessToken', ACCESS_TOKEN)
    } catch (err) {
        if (err.response && err.response.status === 401) {
            alert(err.response.data.message)
            localStorage.clear()
            window.location.href = '/login'
        }
    }
}

StoreAPI.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true
            await refreshAccessToken()
            originalRequest.headers['Authorization'] =
                `${localStorage.getItem('tokenType')} ${localStorage.getItem('accessToken')}`
            return StoreAPI(originalRequest)
        }

        return Promise.reject(error)
    }
)

// 메뉴 목록 조회
export const getStoreInfo = async (storeId) => {
    const response = await StoreAPI.get(`/api/stores/${storeId}/details`, {
        headers: getTokenHeaders(),
    })
    return response.data
}