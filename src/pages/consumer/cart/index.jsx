// CartPage.js
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../../../contexts/cart'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Divider,
    Grid,
    IconButton,
    Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const CartPage = () => {
    const { cartItems, addToCart, removeFromCart, calculateTotal } = useCart()
    const navigate = useNavigate()
    const { storeId } = useParams()

    const handleIncreaseQuantity = (item) => {
        addToCart(item, 1) // 수량을 1씩 증가
    }

    const handleDecreaseQuantity = (menuId) => {
        removeFromCart(menuId)
    }

    console.log(cartItems)

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    <ShoppingCartIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
                    장바구니
                </Typography>

                {cartItems.length === 0 ? (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" align="center">
                                장바구니가 비어있습니다.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            {cartItems.map((item, index) => (
                                <Card key={item.menuId} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Grid
                                            container
                                            spacing={2}
                                            alignItems="center"
                                        >
                                            <Grid item xs={4} sm={3}>
                                                <CardMedia
                                                    component="img"
                                                    height="80"
                                                    image={
                                                        item.image ||
                                                        'https://via.placeholder.com/80'
                                                    }
                                                    alt={item.name}
                                                />
                                            </Grid>
                                            <Grid item xs={8} sm={9}>
                                                <Typography variant="h6">
                                                    {item.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {item.price}원 x{' '}
                                                    {item.quantity}
                                                </Typography>
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    mt={1}
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            handleDecreaseQuantity(
                                                                item.menuId
                                                            )
                                                        }
                                                        size="small"
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <Typography sx={{ mx: 1 }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleIncreaseQuantity(
                                                                item
                                                            )
                                                        }
                                                        size="small"
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ ml: 'auto' }}
                                                    >
                                                        {item.price *
                                                            item.quantity}
                                                        원
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        주문 요약
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        mb={2}
                                    >
                                        <Typography>총 금액:</Typography>
                                        <Typography variant="h6">
                                            {calculateTotal()}원
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        size="large"
                                        onClick={() =>
                                            navigate(
                                                `/consumer/${storeId}/payment`
                                            )
                                        }
                                    >
                                        결제하기
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Container>
    )
}

export default CartPage
