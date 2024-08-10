import axios from 'axios'

export const PaymentAPI = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
})

// 주문 생성
export const createOrder = async (orderData) => {
    const response = await PaymentAPI.post('/api/orders/', orderData)
    return response.data
}

// 주문 알림 전송
export const notifyOrder = async (storeId, orderData) => {
    const response = await PaymentAPI.post(`/api/sse/notify/${storeId}`, orderData)
    return response.data
}