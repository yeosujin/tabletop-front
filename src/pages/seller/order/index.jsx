import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { format, isEqual, startOfDay } from 'date-fns'
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { Cancel, CheckCircle, Fastfood } from '@mui/icons-material'

const OrderPage = () => {
    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()))
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [doneClickCountSetting, setDoneClickCountSetting] = useState(false)
    const [clickedCancelOrders, setClickedCancelOrders] = useState([])
    const [clickedDoneOrders, setClickedDoneOrders] = useState([])

    const { loginId, storeId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const orderType =
        new URLSearchParams(location.search).get('type') || 'received'

    const fetchOrders = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(
                `http://localhost:8080/api/orders/${storeId}`
            )
            if (!response.ok) throw new Error('서버 응답이 실패했습니다')
            const data = await response.json()
            setOrders(data)
        } catch (error) {
            console.error('주문 목록을 불러오는데 실패했습니다:', error)
        } finally {
            setIsLoading(false)
        }
    }, [storeId])

    const handleSSEMessage = useCallback((event) => {
        const newOrder = JSON.parse(event.data)
        setOrders((prevOrders) => [...prevOrders, newOrder])
    }, [])

    const handleSSEUnsubscribe = async () => {
        try {
            console.log('Unsubscribing from SSE...')
            const response = await fetch(
                `http://localhost:8080/api/sse/orders/unsubscribe/${storeId}`,
                { method: 'GET' }
            )
            if (!response.ok) throw new Error('Unsubscribe failed')
            console.log('Successfully unsubscribed from SSE')
        } catch (error) {
            console.error('Failed to unsubscribe from SSE:', error)
        }
    }

    useEffect(() => {
        const fetchDoneClickCountSetting = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/sellers/${loginId}/count-setting`
                )
                if (!response.ok)
                    throw new Error('설정을 가져오는데 실패했습니다')
                const data = await response.json()
                setDoneClickCountSetting(data)
            } catch (error) {
                console.error('설정을 가져오는데 실패했습니다:', error)
            }
        }
        fetchDoneClickCountSetting()
    }, [loginId])

    console.log(doneClickCountSetting)

    useEffect(() => {
        fetchOrders()
        const eventSource = new EventSource(
            `http://localhost:8080/api/sse/orders/subscribe/${storeId}`
        )
        eventSource.onmessage = handleSSEMessage
        eventSource.onerror = (error) => {
            console.error('SSE 에러:', error)
            eventSource.close()
            handleSSEUnsubscribe()
        }
        return () => {
            console.log('Component unmounting, closing SSE connection...')
            eventSource.close()
            handleSSEUnsubscribe().then(() => {
                console.log('SSE cleanup completed')
            })
        }
    }, [storeId, fetchOrders, handleSSEMessage])

    useEffect(() => {
        if (orderType === 'received') setSelectedDate(startOfDay(new Date()))
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

    const handleCancel = useCallback(
        async (orderId) => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/orders/${orderId}/cancel`,
                    { method: 'PUT' }
                )
                if (!response.ok)
                    throw new Error('서버에서 주문 취소에 실패했습니다')
                updateOrderStatus(orderId, 2)
            } catch (error) {
                console.error('주문 취소 실패:', error)
            }
        },
        [updateOrderStatus]
    )

    const handleDone = useCallback(
        async (orderId) => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/orders/${orderId}/complete`,
                    { method: 'PUT' }
                )
                if (!response.ok)
                    throw new Error('주문 완료 처리에 실패했습니다')
                updateOrderStatus(orderId, 1)
            } catch (error) {
                console.error('주문 완료 처리 실패:', error)
            }
        },
        [updateOrderStatus]
    )

    const handleAction = useCallback(
        async (orderId, actionType) => {
            const action = actionType === 'cancel' ? handleCancel : handleDone
            const clickedOrders =
                actionType === 'cancel'
                    ? clickedCancelOrders
                    : clickedDoneOrders
            const setClickedOrders =
                actionType === 'cancel'
                    ? setClickedCancelOrders
                    : setClickedDoneOrders

            if (doneClickCountSetting) {
                if (!clickedOrders.includes(orderId)) {
                    setClickedOrders((prev) => [...prev, orderId])
                    setTimeout(() => {
                        setClickedOrders((prev) =>
                            prev.filter((id) => id !== orderId)
                        )
                    }, 3000)
                } else {
                    await action(orderId)
                    setClickedOrders((prev) =>
                        prev.filter((id) => id !== orderId)
                    )
                }
            } else {
                await action(orderId)
            }
        },
        [
            doneClickCountSetting,
            handleCancel,
            handleDone,
            clickedCancelOrders,
            clickedDoneOrders,
        ]
    )

    const moveToSalas = () => {
        navigate(`/sellers/${loginId}/stores/${storeId}/charts`)
    }

    const calculateOrderTotal = useCallback((order) => {
        return order.orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )
    }, [])

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const orderDate = startOfDay(new Date(order.createdAt))
            const isToday = isEqual(orderDate, startOfDay(new Date()))
            const isSelectedDate = isEqual(orderDate, startOfDay(selectedDate))
            const statusCode =
                { received: 0, done: 1, canceled: 2 }[orderType] ?? -1
            return (
                order.status === statusCode &&
                (orderType === 'received' ? isToday : isSelectedDate)
            )
        })
    }, [orders, selectedDate, orderType])

    const tabTotal = useMemo(() => {
        return filteredOrders.reduce(
            (total, order) => total + calculateOrderTotal(order),
            0
        )
    }, [filteredOrders, calculateOrderTotal])

    const handleTabChange = useCallback(
        (newType) => {
            navigate(`?type=${newType}`)
        },
        [navigate]
    )

    const OrderItem = React.memo(
        ({ order, clickedCancelOrders, clickedDoneOrders, handleAction }) => {
            const isCancelClicked = clickedCancelOrders.includes(order.orderId)
            const isDoneClicked = clickedDoneOrders.includes(order.orderId)

            return (
                <Card
                    elevation={3}
                    sx={{
                        width: 300,
                        minWidth: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '10px',
                        boxShadow:
                            '0px 10px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'translateY(-10px)',
                            boxShadow:
                                '0px 20px 20px rgba(0, 0, 0, 0.1), -4px -4px 12px rgba(0, 0, 0, 0.08)',
                        },
                        overflow: 'hidden',
                        p: 2,
                        flexShrink: 0,
                        height: 'fit-content',
                    }}
                >
                    <CardContent
                        sx={{
                            // flexGrow: 1,
                            p: 1,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: '20px',
                                fontWeight: 600,
                                color: '#1797b8',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                mb: 1,
                            }}
                        >
                            주문 #{order.orderId}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: '16px',
                                color: '#666',
                                mb: 2,
                            }}
                        >
                            {format(
                                new Date(order.createdAt),
                                'yyyy-MM-dd HH:mm'
                            )}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            {order.orderItems.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: '18px',
                                            color: '#1797b8',
                                            py: 1,
                                        }}
                                    >
                                        {item.menuName} x{item.quantity}
                                    </Typography>
                                    {index < order.orderItems.length - 1 && (
                                        <Divider />
                                    )}
                                </React.Fragment>
                            ))}
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: '18px',
                                fontWeight: 600,
                                color: '#1797b8',
                                textAlign: 'right',
                                mt: 'auto',
                            }}
                        >
                            총 {calculateOrderTotal(order).toLocaleString()}원
                        </Typography>
                    </CardContent>
                    {orderType === 'received' && (
                        <Box
                            sx={{
                                p: 1,
                                bgcolor: 'background.default',
                                display: 'flex',
                            }}
                        >
                            <Button
                                variant="text"
                                onClick={() =>
                                    handleAction(order.orderId, 'cancel')
                                }
                                sx={{
                                    flexGrow: 1,
                                    mr: 1,
                                    animation: isCancelClicked
                                        ? 'pulse 1s infinite'
                                        : 'none',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                        '100%': { opacity: 1 },
                                    },
                                }}
                            >
                                <span
                                    style={{
                                        color: '#1c7cff',
                                        fontSize: '16px',
                                    }}
                                >
                                    {isCancelClicked ? '한 번 더 클릭' : '취소'}
                                </span>
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() =>
                                    handleAction(order.orderId, 'done')
                                }
                                sx={{
                                    flexGrow: 3,
                                    bgcolor: 'orange',
                                    '&:hover': { bgcolor: 'darkorange' },
                                    fontSize: '16px',
                                    animation: isDoneClicked
                                        ? 'pulse 1s infinite'
                                        : 'none',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                        '100%': { opacity: 1 },
                                    },
                                }}
                            >
                                {isDoneClicked ? '한 번 더 클릭' : '완료'}
                            </Button>
                        </Box>
                    )}
                </Card>
            )
        }
    )

    if (isLoading) return <Typography>로딩 중...</Typography>

    return (
        <Box
            sx={{
                flexGrow: 1,
                minHeight: '70vh',
            }}
        >
            <AppBar position="static" color="primary" elevation={0}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        주문 관리
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        bgcolor: 'white',
                                        borderRadius: 1,
                                    }}
                                />
                            )}
                            disabled={orderType === 'received'}
                        />
                    </LocalizationProvider>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', p: 3 }}>
                <Box
                    sx={{
                        width: 250,
                        flexShrink: 0,
                        mr: 3,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Card sx={{ mb: 2 }}>
                        <List>
                            {[
                                {
                                    label: '진행중',
                                    type: 'received',
                                    icon: <Fastfood />,
                                },
                                {
                                    label: '완료',
                                    type: 'done',
                                    icon: <CheckCircle />,
                                },
                                {
                                    label: '취소',
                                    type: 'canceled',
                                    icon: <Cancel />,
                                },
                            ].map(({ label, type, icon }) => (
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
                                        <ListItemText
                                            primary={label}
                                            primaryTypographyProps={{
                                                sx: {
                                                    fontWeight: 'bold',
                                                    fontSize: '1.15rem',
                                                },
                                            }}
                                        />
                                        {icon}
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                    <Button
                        color="secondary"
                        variant="contained"
                        sx={{ color: 'white', py: 1.5 }}
                        onClick={moveToSalas}
                        fullWidth
                    >
                        Salas
                    </Button>
                </Box>
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
                            '&::-webkit-scrollbar': {
                                height: '8px',
                                backgroundColor: '#F5F5F5',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                borderRadius: '4px',
                                backgroundColor: '#888',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: '#555',
                            },
                            '&::-webkit-scrollbar-track': {
                                borderRadius: '4px',
                                backgroundColor: '#F5F5F5',
                            },
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#888 #F5F5F5',
                        }}
                    >
                        {filteredOrders.map((order) => (
                            <OrderItem
                                key={order.orderId}
                                order={order}
                                clickedCancelOrders={clickedCancelOrders}
                                clickedDoneOrders={clickedDoneOrders}
                                handleAction={handleAction}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default OrderPage
