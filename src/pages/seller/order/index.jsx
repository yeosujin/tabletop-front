import React, { useMemo, useState } from 'react'
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
import { format, isEqual } from 'date-fns'

const OrderPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [activeTab, setActiveTab] = useState('진행중')
    const [orders, setOrders] = useState({
        진행중: [
            {
                id: 1,
                date: new Date('2024-07-10'),
                menus: [
                    { name: '햄버거', price: 5000, quantity: 3 },
                    { name: '콜라', price: 1500, quantity: 2 },
                ],
            },
            {
                id: 2,
                date: new Date('2024-07-11'),
                menus: [
                    { name: '피자', price: 12000, quantity: 1 },
                    { name: '샐러드', price: 3000, quantity: 5 },
                ],
            },
        ],
        완료: [
            {
                id: 3,
                date: new Date('2023-05-10'),
                menus: [
                    { name: '파스타', price: 8000, quantity: 1 },
                    { name: '아이스크림', price: 2000, quantity: 1 },
                ],
            },
            {
                id: 4,
                date: new Date('2023-05-11'),
                menus: [
                    { name: '스테이크', price: 15000, quantity: 1 },
                    { name: '와인', price: 10000, quantity: 1 },
                ],
            },
        ],
    })

    const handleCancel = (orderId) => {
        console.log('주문 취소:', orderId)
    }

    const handleDone = (orderId) => {
        console.log('주문 완료:', orderId)
    }

    const filteredOrders = useMemo(() => {
        return {
            진행중: orders.진행중.filter((order) =>
                isEqual(
                    format(order.date, 'yyyy-MM-dd'),
                    format(selectedDate, 'yyyy-MM-dd')
                )
            ),
            완료: orders.완료.filter((order) =>
                isEqual(
                    format(order.date, 'yyyy-MM-dd'),
                    format(selectedDate, 'yyyy-MM-dd')
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
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            {format(order.date, 'yyyy-MM-dd')}
                                        </Typography>
                                        <List>
                                            {order.menus.map((menu, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={
                                                            activeTab ===
                                                            '진행중'
                                                                ? `${menu.name} - ${menu.quantity}개`
                                                                : `${menu.name} - ${menu.price}원`
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
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
