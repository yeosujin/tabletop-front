import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../../../contexts/cart'
import { useTable } from '../../../contexts/table-number'
import {
    Avatar,
    Box,
    Button,
    Card,
    CardMedia,
    createTheme,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    ThemeProvider,
    Typography,
} from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff9f1c',
        },
        secondary: {
            main: '#2ec4b6',
        },
        background: {
            default: '#fdfffc',
        },
        text: {
            primary: '#011627',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                },
            },
        },
    },
})

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([])
    const [storeName, setStoreName] = useState('')
    const { storeId } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { cartItems, addToCart } = useCart()
    const { setTableNumber } = useTable()

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        const tableNumber = searchParams.get('tableNumber')
        setTableNumber(tableNumber)

        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`/api/stores/${storeId}/menus`)
                setMenuItems(response.data)
            } catch (error) {
                console.error('메뉴를 불러오는데 실패했습니다:', error)
            }
        }

        const fetchStoreInfo = async () => {
            try {
                const response = await axios.get(`/api/stores/${storeId}`)
                setStoreName(response.data.name)
            } catch (error) {
                console.error('가게 정보를 불러오는데 실패했습니다:', error)
            }
        }

        fetchMenuItems()
        fetchStoreInfo()
    }, [storeId, searchParams, setTableNumber])

    const handleItemClick = (item) => {
        setSelectedItem(item)
        setQuantity(1)
        setDrawerOpen(true)
    }

    const handleAddToCart = () => {
        addToCart({
            menuId: selectedItem.id,
            name: selectedItem.name,
            price: selectedItem.price,
            quantity: quantity,
        })
        setDrawerOpen(false)
    }

    const handleCartClick = () => {
        navigate(`/consumer/${storeId}/cart`)
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    maxWidth: 600,
                    margin: 'auto',
                    p: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Typography variant="h4" gutterBottom color="primary">
                    {storeName}
                </Typography>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            key={item.id}
                            button
                            onClick={() => handleItemClick(item)}
                            divider
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                columnGap: 4,
                                '&:hover': {
                                    bgcolor: 'rgba(255, 159, 28, 0.1)',
                                },
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    src={item.image}
                                    alt={item.name}
                                    sx={{ width: 56, height: 56 }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="h6">
                                        {item.name}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {item.description}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="primary"
                                            fontWeight="bold"
                                        >
                                            {item.price}원
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
                <IconButton
                    color="primary"
                    aria-label="cart"
                    onClick={handleCartClick}
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        '&:hover': {
                            bgcolor: 'primary.light',
                        },
                    }}
                >
                    <AddShoppingCartIcon />
                    <Typography variant="badge" sx={{ ml: 1 }}>
                        {cartItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                        )}
                    </Typography>
                </IconButton>

                <Drawer
                    anchor="bottom"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >
                    <Box
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'background.default',
                        }}
                    >
                        {selectedItem && (
                            <Box sx={{ width: '100%', maxWidth: 400 }}>
                                <Card
                                    sx={{
                                        mb: 2,
                                        width: '100%',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={selectedItem.image}
                                        alt={selectedItem.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                </Card>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    mb={1}
                                >
                                    {selectedItem.name}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    fontWeight="bold"
                                    mb={2}
                                >
                                    {selectedItem.price}원
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 3,
                                        bgcolor: 'rgba(255, 159, 28, 0.1)',
                                        borderRadius: 2,
                                        p: 1,
                                    }}
                                >
                                    <IconButton
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(1, quantity - 1)
                                            )
                                        }
                                        color="primary"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <TextField
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(
                                                Math.max(
                                                    1,
                                                    parseInt(e.target.value) ||
                                                        1
                                                )
                                            )
                                        }
                                        inputProps={{
                                            min: 1,
                                            style: { textAlign: 'center' },
                                        }}
                                        sx={{ width: 60, mx: 1 }}
                                    />
                                    <IconButton
                                        onClick={() =>
                                            setQuantity(quantity + 1)
                                        }
                                        color="primary"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleAddToCart}
                                    startIcon={<AddShoppingCartIcon />}
                                    sx={{ py: 1.5 }}
                                >
                                    장바구니에 담기
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Drawer>
            </Box>
        </ThemeProvider>
    )
}

export default MenuPage
