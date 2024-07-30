// CartPage.js
import React, { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCart } from '../../../contexts/cart'
import { useTable } from '../../../contexts/table-number'
import {
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import { Remove } from '@mui/icons-material'

const CartPage = () => {
    const { cartItems, addToCart, removeFromCart, calculateTotal } = useCart()
    const navigate = useNavigate()
    const { storeId } = useParams()
    const [searchParams] = useSearchParams()
    const { setTableNumber } = useTable()

    useEffect(() => {
        const tableNumber = searchParams.get('tableNumber')
        setTableNumber(tableNumber)
        console.log('Table Number:', tableNumber)
    }, [searchParams, setTableNumber])

    const handleIncreaseQuantity = (item) => {
        addToCart(item)
    }

    const handleDecreaseQuantity = (menuId) => {
        removeFromCart(menuId)
    }

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', p: 2 }}>
            {cartItems.length === 0 ? (
                <Typography>장바구니가 비어있습니다.</Typography>
            ) : (
                <Paper elevation={3}>
                    <List>
                        {cartItems.map((item, index) => (
                            <React.Fragment key={item.menuId}>
                                <ListItem
                                    secondaryAction={
                                        <Box>
                                            <IconButton
                                                onClick={() =>
                                                    handleDecreaseQuantity(
                                                        item.menuId
                                                    )
                                                }
                                            >
                                                <Remove />
                                            </IconButton>
                                            <Typography component="span">
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                onClick={() =>
                                                    handleIncreaseQuantity(item)
                                                }
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`${item.price * item.quantity}원`}
                                    />
                                </ListItem>
                                {index < cartItems.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                    <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                        <Typography variant="h6">
                            총 금액: {calculateTotal()}원
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() =>
                                navigate(`/consumer/${storeId}/payment`)
                            }
                        >
                            결제하기
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    )
}

export default CartPage
