import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { format, isEqual, startOfDay } from 'date-fns'
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    createTheme,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    ThemeProvider,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { Cancel, CheckCircle, Fastfood } from '@mui/icons-material'

const theme = createTheme({
    palette: {
        primary: { main: '#ff9f1c' },
        secondary: { main: '#ff9f1c' },
        background: { default: '#fdfcdc' },
    },
})

const OrderPage = () => {
    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()))
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { username, storeid } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const orderType = new URLSearchParams(location.search).get('type') || 'received'

    const fetchOrders = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(
                `http://localhost:8080/api/orders/${storeid}`
            )
            if (!response.ok) throw new Error('서버 응답이 실패했습니다')
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
        return () => eventSource.close()
    }, [storeid, fetchOrders])

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

    const handleCancel = async (orderId) => {
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
    }

    const handleDone = async (orderId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/orders/${orderId}/complete`,
                { method: 'PUT' }
            )
            if (!response.ok) throw new Error('주문 완료 처리에 실패했습니다')
            updateOrderStatus(orderId, 1)
        } catch (error) {
            console.error('주문 완료 처리 실패:', error)
        }
    }

    const filteredOrders = orders.filter((order) => {
        const orderDate = startOfDay(new Date(order.createdAt))
        const isToday = isEqual(orderDate, startOfDay(new Date()))
        const isSelectedDate = isEqual(orderDate, startOfDay(selectedDate))
        const statusCode = { now: 0, done: 1, canceled: 2 }[orderType] ?? -1
        return (
            order.status === statusCode &&
            (orderType === 'now' ? isToday : isSelectedDate)
        )
    })

    const calculateOrderTotal = (order) =>
        order.orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )

<<<<<<< Updated upstream
    const tabTotal = filteredOrders.reduce(
        (total, order) => total + calculateOrderTotal(order),
        0
    )

    const handleTabChange = (newType) => {
        navigate(
            `/sellers/${username}/stores/${storeid}/orders?type=${newType}`
        )
    }
=======
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const orderDate = startOfDay(new Date(order.createdAt))
            const isToday = isEqual(orderDate, startOfDay(new Date()))
            const isSelectedDate = isEqual(orderDate, startOfDay(selectedDate))
            const statusCode = { received: 0, done: 1, canceled: 2 }[orderType] ?? -1
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
            navigate(`/sellers/${username}/stores/${storeid}/orders?type=${newType}`)
        },
        [navigate, username, storeid]
    )

    const OrderItem = React.memo(({ order }) => (
        <Card
            elevation={3}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography variant="h6" component="div">
                        주문 #{order.orderId}
                    </Typography>
                    <Chip
                        avatar={<Avatar>{order.orderItems.length}</Avatar>}
                        label="항목"
                        color="secondary"
                        size="small"
                    />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                </Typography>
                <Box
                    sx={{
                        mt: 2,
                        maxHeight: 150,
                        overflowY: 'auto',
                    }}
                >
                    {order.orderItems.map((menu, index) => (
                        <Tooltip
                            key={index}
                            title={`${menu.menuName} - ${menu.quantity}개, ${menu.price}원`}
                            arrow
                        >
                            <Chip
                                label={`${menu.menuName} x${menu.quantity}`}
                                size="small"
                                sx={{ m: 0.5 }}
                            />
                        </Tooltip>
                    ))}
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        mt: 2,
                        textAlign: 'right',
                    }}
                >
                    총 금액: {calculateOrderTotal(order).toLocaleString()}원
                </Typography>
            </CardContent>
            {orderType === 'received' && (
                <Box
                    sx={{
                        p: 2,
                        bgcolor: 'background.default',
                        display: 'flex',
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => handleCancel(order.orderId)}
                        sx={{ flexGrow: 1 }}
                    >
                        취소
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleDone(order.orderId)}
                        color="secondary"
                        sx={{ flexGrow: 3 }}
                    >
                        완료
                    </Button>
                </Box>
            )}
        </Card>
    ))
>>>>>>> Stashed changes

    if (isLoading) return <Typography>로딩 중...</Typography>

    return (
<<<<<<< Updated upstream
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    minHeight: '100vh',
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
=======
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: 'background.default',
                minHeight: '100vh',
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
                    <Button
                        color="secondary"
                        variant="contained"
                        sx={{ color: 'white', marginX: '24px' }}
                        onClick={moveToSalas}
                    >
                        Salas
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', p: 3 }}>
                <Box sx={{ width: 200, flexShrink: 0, mr: 3 }}>
                    <Card>
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
>>>>>>> Stashed changes
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
                <Box sx={{ display: 'flex', p: 3 }}>
                    <Box sx={{ width: 200, flexShrink: 0, mr: 3 }}>
                        <Card>
                            <List>
                                {[
                                    {
                                        label: '진행중',
                                        type: 'now',
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
                                            onClick={() =>
                                                handleTabChange(type)
                                            }
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
                                                    sx: { fontWeight: 'bold' },
                                                }}
                                            />
                                            {icon}
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
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
                                        총{' '}
                                        {orderType === 'done' ? '완료' : '취소'}{' '}
                                        금액: {tabTotal.toLocaleString()}원
                                    </Typography>
                                </Paper>
                            )}
                        <Grid container spacing={3}>
                            {filteredOrders.map((order) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={order.orderId}
                                >
                                    <Card
                                        elevation={3}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    component="div"
                                                >
                                                    주문 #{order.orderId}
                                                </Typography>
                                                <Chip
                                                    avatar={
                                                        <Avatar>
                                                            {
                                                                order.orderItems
                                                                    .length
                                                            }
                                                        </Avatar>
                                                    }
                                                    label="항목"
                                                    color="secondary"
                                                    size="small"
                                                />
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                gutterBottom
                                            >
                                                {format(
                                                    new Date(order.createdAt),
                                                    'yyyy-MM-dd HH:mm:ss'
                                                )}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    maxHeight: 150,
                                                    overflowY: 'auto',
                                                }}
                                            >
                                                {order.orderItems.map(
                                                    (menu, index) => (
                                                        <Tooltip
                                                            key={index}
                                                            title={`${menu.menuName} - ${menu.quantity}개, ${menu.price}원`}
                                                            arrow
                                                        >
                                                            <Chip
                                                                label={`${menu.menuName} x${menu.quantity}`}
                                                                size="small"
                                                                sx={{ m: 0.5 }}
                                                            />
                                                        </Tooltip>
                                                    )
                                                )}
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    mt: 2,
                                                    textAlign: 'right',
                                                }}
                                            >
                                                총 금액:{' '}
                                                {calculateOrderTotal(
                                                    order
                                                ).toLocaleString()}
                                                원
                                            </Typography>
                                        </CardContent>
                                        {orderType === 'now' && (
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    bgcolor:
                                                        'background.default',
                                                    display: 'flex',
                                                }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    onClick={() =>
                                                        handleCancel(
                                                            order.orderId
                                                        )
                                                    }
                                                    sx={{ flexGrow: 1 }}
                                                >
                                                    취소
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    onClick={() =>
                                                        handleDone(
                                                            order.orderId
                                                        )
                                                    }
                                                    color="secondary"
                                                    sx={{ flexGrow: 3 }}
                                                >
                                                    완료
                                                </Button>
                                            </Box>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default OrderPage
