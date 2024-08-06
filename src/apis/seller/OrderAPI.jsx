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

export const OrderAPI = axios.create({
    baseURL: `${process.env.API_URL}`,
})

const refreshAccessToken = async () => {
    try {
        const response = await OrderAPI.post(`/api/auth/token/refresh`, null, {
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

OrderAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true
            await refreshAccessToken()
            originalRequest.headers['Authorization'] =
                `${localStorage.getItem('tokenType')} ${localStorage.getItem('accessToken')}`
            return OrderAPI(originalRequest)
        }

        return Promise.reject(error)
    }
)

// 주문 목록 조회
export const getOrders = async (storeId) => {
    const response = await OrderAPI.get(`/api/orders/${storeId}`, {
        headers: getTokenHeaders(),
    })
    return response.data
}

// 주문 취소
export const cancelOrder = async (orderId) => {
    const response = await OrderAPI.put(`/api/orders/${orderId}/cancel`, null, {
        headers: getTokenHeaders(),
    })
    return response.data
}

// 주문 완료
export const completeOrder = async (orderId) => {
    const response = await OrderAPI.put(
        `/api/orders/${orderId}/complete`,
        null,
        {
            headers: getTokenHeaders(),
        }
    )
    return response.data
}

// 판매자 설정 조회
export const getSellerSettings = async (loginId) => {
    const response = await OrderAPI.get(
        `/api/sellers/${loginId}/count-setting`,
        {
            headers: getTokenHeaders(),
        }
    )
    return response.data
}

// SSE 구독 해제
export const unsubscribeSSE = async (storeId) => {
    const response = await OrderAPI.get(
        `/api/sse/orders/unsubscribe/${storeId}`,
        {
            headers: getTokenHeaders(),
        }
    )
    return response.data
}

export default OrderAPI
