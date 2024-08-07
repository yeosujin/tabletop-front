import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import useSSE from './usesse'
import OrderSidebar from './ordersidebar'
import OrderItem from './orderitem'
import useOrders from './useorder'

const ROUTES = {
    CHARTS: (loginId, storeId) =>
        `/sellers/${loginId}/stores/${storeId}/charts`,
    QR: (loginId, storeId) => `/sellers/${loginId}/stores/${storeId}/qr`,
}

const OrderPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const { loginId, storeId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const orderType =
        new URLSearchParams(location.search).get('type') || 'received'

    const {
        orders,
        isLoading,
        doneClickCountSetting,
        clickedCancelOrders,
        clickedDoneOrders,
        handleAction,
        calculateOrderTotal,
        filteredOrders,
        tabTotal,
        addNewOrder,
    } = useOrders(storeId, loginId, selectedDate, orderType)

    useSSE(storeId, addNewOrder)

    const handleTabChange = (newType) => {
        navigate(`?type=${newType}`)
    }

    const moveToSales = () => navigate(ROUTES.CHARTS(loginId, storeId))
    const moveToQr = () => navigate(ROUTES.QR(loginId, storeId))

    if (isLoading) return <Typography>로딩 중...</Typography>

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ flexGrow: 1, minHeight: '70vh', display: 'flex', p: 3 }}>
                <OrderSidebar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    orderType={orderType}
                    handleTabChange={handleTabChange}
                    moveToSales={moveToSales}
                    moveToQr={moveToQr}
                />
                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    {(orderType === 'done' || orderType === 'canceled') &&
                        tabTotal > 0 && (
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    mb: 3,
                                    bgcolor: 'secondary.main',
                                    color: 'white',
                                }}
                            >
                                <Typography variant="h6">
                                    총 {orderType === 'done' ? '완료' : '취소'}{' '}
                                    금액: {tabTotal.toLocaleString()}원
                                </Typography>
                            </Paper>
                        )}
                    <Box
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: 3,
                            pb: 2,
                            px: 2,
                            py: 1.5,
                        }}
                    >
                        {filteredOrders.map((order) => (
                            <OrderItem
                                key={order.orderId}
                                order={order}
                                clickedCancelOrders={clickedCancelOrders}
                                clickedDoneOrders={clickedDoneOrders}
                                handleAction={handleAction}
                                calculateOrderTotal={calculateOrderTotal}
                                orderType={orderType}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </LocalizationProvider>
    )
}

export default OrderPage
