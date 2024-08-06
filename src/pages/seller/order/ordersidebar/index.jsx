import React from 'react'
import {
    Box,
    Button,
    Card,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { Cancel, CheckCircle, Fastfood } from '@mui/icons-material'

const OrderSidebar = ({
    selectedDate,
    setSelectedDate,
    orderType,
    handleTabChange,
    moveToSales,
    moveToQr,
}) => {
    return (
        <Box
            sx={{
                width: 250,
                flexShrink: 0,
                mr: 3,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        sx={{ backgroundColor: 'white', borderRadius: 1 }}
                    />
                )}
                disabled={orderType === 'received'}
            />
            <Card sx={{ mb: 2 }}>
                <List>
                    {[
                        {
                            label: '진행중',
                            type: 'received',
                            icon: <Fastfood />,
                        },
                        { label: '완료', type: 'done', icon: <CheckCircle /> },
                        { label: '취소', type: 'canceled', icon: <Cancel /> },
                    ].map(({ label, type, icon }) => (
                        <ListItem key={type} disablePadding>
                            <ListItemButton
                                selected={orderType === type}
                                onClick={() => handleTabChange(type)}
                                sx={
                                    {
                                        /* ... 기존 스타일 유지 ... */
                                    }
                                }
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
                sx={{ color: 'white', py: 1.5, mb: 1 }}
                onClick={moveToSales}
                fullWidth
            >
                매출 통계
            </Button>
            <Button
                color="secondary"
                variant="contained"
                sx={{ color: 'white', py: 1.5, mt: 1 }}
                onClick={moveToQr}
                fullWidth
            >
                QR 발급
            </Button>
        </Box>
    )
}

export default OrderSidebar
