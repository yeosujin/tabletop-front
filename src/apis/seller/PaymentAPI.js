export const PaymentAPI = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
})

export const createOrder = async (orderData) => {
    try {
        const response = await PaymentAPI.post('/api/orders/', orderData)
        console.log('Order created successfully:', response.data)
        return response.data
    } catch (error) {
        console.error('Failed to create order:', error.response?.data || error.message)
        throw error
    }
}

export const notifyOrder = async (storeId, orderData) => {
    try {
        const response = await PaymentAPI.post(`/api/sse/notify/${storeId}`, orderData)
        console.log('Order notification sent successfully:', response.data)
        return response.data
    } catch (error) {
        console.error('Failed to notify order:', error.response?.data || error.message)
        throw error
    }
}