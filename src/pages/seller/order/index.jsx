import React, { useEffect, useMemo, useState } from 'react'
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
    const [orders, setOrders] = useState({
        진행중: [],
        완료: [],
    })

    const { storeId } = useParams()

    useEffect(() => {
        // 초기 주문 목록 로드
        // fetchOrders()

        // SSE 연결 설정
        const eventSource = new EventSource(
            `http://localhost:8080/api/sse/orders/${storeId}`
        )

        eventSource.onmessage = (event) => {
            const newOrder = JSON.parse(event.data)
            setOrders((prevOrders) => ({
                ...prevOrders,
                진행중: [...prevOrders.진행중, newOrder],
            }))
        }

        eventSource.onerror = (error) => {
            console.error('SSE 에러:', error)
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }, [storeId])

    // const fetchOrders = async () => {
    //     try {
    //         const response = await fetch(
    //             `http://localhost:8080/api/orders/${storeId}`
    //         )
    //         const data = await response.json()
    //         setOrders(data)
    //     } catch (error) {
    //         console.error('주문 목록 로딩 실패:', error)
    //     }
    // }

    console.log(orders)

    useEffect(() => {
        if (activeTab === '진행중') {
            setSelectedDate(startOfDay(new Date()))
        }
    }, [activeTab])

    const handleCancel = async (orderId) => {
        // try {
        //     await fetch(`http://localhost:8080/api/orders/${orderId}/cancel`, {
        //         method: 'POST',
        //     })
        //     fetchOrders() // 주문 목록 새로고침
        // } catch (error) {
        //     console.error('주문 취소 실패:', error)
        // }
    }

    const handleDone = async (orderId) => {
        // try {
        //     await fetch(
        //         `http://localhost:8080/api/orders/${orderId}/complete`,
        //         { method: 'POST' }
        //     )
        //     fetchOrders() // 주문 목록 새로고침
        // } catch (error) {
        //     console.error('주문 완료 처리 실패:', error)
        // }
    }

    const filteredOrders = useMemo(() => {
        return {
            진행중: orders.진행중.filter((order) =>
                isEqual(
                    startOfDay(Date.parse(order.createdAt)),
                    startOfDay(new Date())
                )
            ),
            완료: orders.완료.filter((order) =>
                isEqual(
                    startOfDay(Date.parse(order.createdAt)),
                    startOfDay(selectedDate)
                )
            ),
        }
    }, [orders, selectedDate])

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
                        {['진행중', '완료'].map((text) => (
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
                        {filteredOrders[activeTab].map((order) => (
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
                                                            primary={
                                                                activeTab ===
                                                                '진행중'
                                                                    ? `${menu.menuName} - ${menu.quantity}개`
                                                                    : `${menu.menuName} - ${menu.price}원`
                                                            }
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
                                        {activeTab === '완료' && (
                                            <Typography variant="body1">
                                                총 가격:{' '}
                                                {order.menus.reduce(
                                                    (sum, menu) =>
                                                        sum + menu.price,
                                                    0
                                                )}
                                                원
                                            </Typography>
                                        )}
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
