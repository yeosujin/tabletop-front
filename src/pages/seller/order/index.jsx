import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { format, isEqual, startOfDay } from 'date-fns'
import { useParams } from 'react-router-dom'

const OrderPage = () => {
    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()))
    const [activeTab, setActiveTab] = useState('진행중')
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { storeId } = useParams()

    const fetchOrders = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(
                `http://localhost:8080/api/orders/${storeId}`
            )
            if (!response.ok) {
                throw new Error('서버 응답이 실패했습니다')
            }
            const data = await response.json()
            setOrders(data)
        } catch (error) {
            console.error('주문 목록을 불러오는데 실패했습니다:', error)
        } finally {
            setIsLoading(false)
        }
    }, [storeId])

    useEffect(() => {
        fetchOrders()

        const eventSource = new EventSource(
            `http://localhost:8080/api/sse/orders/${storeId}`
        )

        eventSource.onmessage = (event) => {
            const newOrder = JSON.parse(event.data)
            setOrders((prevOrders) => [...prevOrders, newOrder])
        }

        eventSource.onerror = (error) => {
            console.error('SSE 에러:', error)
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }, [storeId, fetchOrders])

    useEffect(() => {
        if (activeTab === '진행중') {
            setSelectedDate(startOfDay(new Date()))
        }
    }, [activeTab])

    const handleCancel = async (orderId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/orders/${orderId}/cancel`,
                {
                    method: 'POST',
                }
            )
            if (!response.ok) {
                throw new Error('주문 취소에 실패했습니다')
            }
            fetchOrders() // 주문 목록 새로고침
        } catch (error) {
            console.error('주문 취소 실패:', error)
        }
    }

    const handleDone = async (orderId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/orders/${orderId}/complete`,
                {
                    method: 'POST',
                }
            )
            if (!response.ok) {
                throw new Error('주문 완료 처리에 실패했습니다')
            }
            fetchOrders() // 주문 목록 새로고침
        } catch (error) {
            console.error('주문 완료 처리 실패:', error)
        }
    }

    const filteredOrders = useMemo(() => {
        const getStatusCode = (tab) => {
            switch (tab) {
                case '진행중':
                    return 0
                case '완료':
                    return 1
                case '취소':
                    return 2
                default:
                    return -1
            }
        }

        return orders.filter((order) => {
            const orderDate = startOfDay(new Date(order.createdAt))
            const isToday = isEqual(orderDate, startOfDay(new Date()))
            const isSelectedDate = isEqual(orderDate, startOfDay(selectedDate))

            return (
                order.status === getStatusCode(activeTab) &&
                (activeTab === '진행중' ? isToday : isSelectedDate)
            )
        })
    }, [orders, selectedDate, activeTab])

    if (isLoading) {
        return <Typography>로딩 중...</Typography>
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit">QR</Button>
                    <Button color="inherit">Sales</Button>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                            disabled={activeTab === '진행중'}
                        />
                    </LocalizationProvider>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <List>
                        {['진행중', '완료', '취소'].map((text) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton
                                    selected={activeTab === text}
                                    onClick={() => setActiveTab(text)}
                                >
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={10}>
                    <Grid container spacing={2}>
                        {filteredOrders.map((order) => (
                            <Grid item xs={12} sm={6} md={4} key={order.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">
                                            주문 #{order.id}
                                        </Typography>
                                        <Typography variant="body2">
                                            {format(
                                                order.createdAt.split('T')[0],
                                                'yyyy-MM-dd'
                                            )}
                                        </Typography>
                                        <List>
                                            {order.orderItems.map(
                                                (menu, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemText
                                                            primary={`${menu.menuName} - ${menu.quantity}개`}
                                                            secondary={`${menu.price}원`}
                                                        />
                                                    </ListItem>
                                                )
                                            )}
                                        </List>
                                        {activeTab === '진행중' && (
                                            <Box>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() =>
                                                        handleCancel(order.id)
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() =>
                                                        handleDone(order.id)
                                                    }
                                                >
                                                    Done
                                                </Button>
                                            </Box>
                                        )}
                                        <Typography variant="body1">
                                            총 가격:{' '}
                                            {order.orderItems.reduce(
                                                (sum, item) =>
                                                    sum +
                                                    item.price * item.quantity,
                                                0
                                            )}
                                            원
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default OrderPage
