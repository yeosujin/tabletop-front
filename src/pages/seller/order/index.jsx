import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    createTheme,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { format, isEqual, startOfDay } from 'date-fns'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff9f1c',
        },
        secondary: {
            main: '#ff9f1c',
        },
        background: {
            default: '#fdfcdc',
        },
    },
})

const OrderPage = () => {
    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()))
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { username, storeid } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)
    const orderType = queryParams.get('type') || 'now'

    const fetchOrders = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(
                `http://localhost:8080/api/orders/${storeid}`
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
    }, [storeid])

    useEffect(() => {
        fetchOrders()

        const eventSource = new EventSource(
            `http://localhost:8080/api/sse/orders/${storeid}`
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
    }, [storeid, fetchOrders])

    useEffect(() => {
        if (orderType === 'now') {
            setSelectedDate(startOfDay(new Date()))
        }
    }, [orderType])

    const updateOrderStatus = useCallback((orderId, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.orderId === orderId
                    ? { ...order, status: newStatus }
                    : order
            )
        )
    }, [])

    const handleCancel = async (orderId, impUid) => {
        try {
            // // 1. PortOne API를 통한 결제 취소
            // const portOneResponse = await axios.post(
            //     `https://api.portone.io/payments/${impUid}/cancel`,
            //     { reason: '취소' },
            //     {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             Authorization: `Basic ${btoa(process.env.REACT_APP_PORTONE_API_KEY + ':')}`,
            //         },
            //     }
            // )

            // if (portOneResponse.status === 200) {
            // 2. Spring Boot 서버에 주문 취소 요청
            const response = await fetch(
                `http://localhost:8080/api/orders/${orderId}/cancel`,
                {
                    method: 'PUT',
                }
            )

            if (!response.ok) {
                throw new Error('서버에서 주문 취소에 실패했습니다')
            }
            updateOrderStatus(orderId, 2)
            // } else {
            //     throw new Error('PortOne API 결제 취소에 실패했습니다')
            // }
        } catch (error) {
            console.error('주문 취소 실패:', error)
            // 사용자에게 에러 메시지 표시
        }
    }

    const handleDone = async (orderId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/orders/${orderId}/complete`,
                {
                    method: 'PUT',
                }
            )
            if (!response.ok) {
                throw new Error('주문 완료 처리에 실패했습니다')
            }
            updateOrderStatus(orderId, 1) // 완료 상태로 업데이트
        } catch (error) {
            console.error('주문 완료 처리 실패:', error)
        }
    }

    const filteredOrders = useMemo(() => {
        const getStatusCode = (type) => {
            switch (type) {
                case 'now':
                    return 0
                case 'done':
                    return 1
                case 'canceled':
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
                order.status === getStatusCode(orderType) &&
                (orderType === 'now' ? isToday : isSelectedDate)
            )
        })
    }, [orders, selectedDate, orderType])

    if (isLoading) {
        return <Typography>로딩 중...</Typography>
    }

    const handleTabChange = (newType) => {
        navigate(
            `/sellers/${username}/stores/${storeid}/orders?type=${newType}`
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Button color="inherit">Sales</Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={selectedDate}
                                onChange={(newValue) =>
                                    setSelectedDate(newValue)
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        sx={{
                                            bgcolor: 'white',
                                            borderRadius: 1,
                                        }}
                                    />
                                )}
                                disabled={orderType === 'now'}
                            />
                        </LocalizationProvider>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <List>
                            {[
                                { label: '진행중', type: 'now' },
                                { label: '완료', type: 'done' },
                                { label: '취소', type: 'canceled' },
                            ].map(({ label, type }) => (
                                <ListItem key={type} disablePadding>
                                    <ListItemButton
                                        selected={orderType === type}
                                        onClick={() => handleTabChange(type)}
                                        sx={{
                                            '&.Mui-selected': {
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: 'primary.dark',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemText primary={label} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={10}>
                        <Grid container spacing={2}>
                            {filteredOrders.map((order) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={order.orderId}
                                >
                                    <Card sx={{ bgcolor: '#fdfcdc' }}>
                                        <CardContent>
                                            <Typography variant="h6">
                                                주문 #{order.orderId}
                                            </Typography>
                                            <Typography variant="body2">
                                                {format(
                                                    new Date(order.createdAt),
                                                    'yyyy-MM-dd HH:mm:ss'
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
                                            {orderType === 'now' && (
                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                        display: 'flex',
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() =>
                                                            handleCancel(
                                                                order.orderId,
                                                                order.imp_uid
                                                            )
                                                        }
                                                        sx={{
                                                            flex: 4,
                                                            mr: 1,
                                                            color: 'black',
                                                            borderColor:
                                                                'black',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    'rgba(0, 0, 0, 0.04)',
                                                                borderColor:
                                                                    'black',
                                                            },
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() =>
                                                            handleDone(
                                                                order.orderId
                                                            )
                                                        }
                                                        sx={{
                                                            flex: 6,
                                                            bgcolor: '#ff9f1c',
                                                            '&:hover': {
                                                                bgcolor:
                                                                    '#e58e1a',
                                                            },
                                                        }}
                                                    >
                                                        Done
                                                    </Button>
                                                </Box>
                                            )}
                                            {/* ... (나머지 카드 내용) */}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default OrderPage
