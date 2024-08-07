import axios from 'axios'

const getTokenHeaders = () => {
    const TOKEN_TYPE = localStorage.getItem('tokenType')
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    let REFRESH_TOKEN = localStorage.getItem('refreshToken')

    return {
        Authorization: `${TOKEN_TYPE} ${ACCESS_TOKEN}`,
        REFRESH_TOKEN: REFRESH_TOKEN,
    }
}

export const PaymentAPI = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
})

const refreshAccessToken = async () => {
    try {
        const response = await PaymentAPI.post(`/api/auth/token/refresh`, null, {
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

PaymentAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true
            await refreshAccessToken()
            originalRequest.headers['Authorization'] =
                `${localStorage.getItem('tokenType')} ${localStorage.getItem('accessToken')}`
            return PaymentAPI(originalRequest)
        }

        return Promise.reject(error)
    }
)

// 주문 생성
export const createOrder = async (orderData) => {
    const response = await PaymentAPI.post('/api/orders/', orderData, {
        headers: getTokenHeaders(),
    })
    return response.data
}

// 주문 알림 전송
export const notifyOrder = async (storeId, orderData) => {
    const response = await PaymentAPI.post(
        `/api/sse/notify/${storeId}`,
        orderData,
        {
            headers: getTokenHeaders(),
        }
    )
    return response.data
}

export default PaymentAPI