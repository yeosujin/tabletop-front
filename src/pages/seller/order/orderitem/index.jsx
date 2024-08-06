import React from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Typography,
} from '@mui/material'
import { format } from 'date-fns'

const OrderItem = React.memo(
    ({
        order,
        clickedCancelOrders,
        clickedDoneOrders,
        handleAction,
        calculateOrderTotal,
        orderType,
    }) => {
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
                    sx={{ p: 1, display: 'flex', flexDirection: 'column' }}
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
                        주문 #{order.waitingNumber}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '16px',
                            color: '#666',
                            mb: 2,
                        }}
                    >
                        {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        {order.orderItems.map((item, index) => (
                            <React.Fragment key={index}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '24px',
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
                                style={{ color: '#1c7cff', fontSize: '16px' }}
                            >
                                {isCancelClicked ? '한 번 더 클릭' : '취소'}
                            </span>
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleAction(order.orderId, 'done')}
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

export default OrderItem
