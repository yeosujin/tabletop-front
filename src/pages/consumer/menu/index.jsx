import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCart } from '../../../contexts/cart'
import { useTable } from '../../../contexts/table-number'
import { getMenus } from '../../../apis/seller/MenuAPI'
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardMedia,
    createTheme,
    Drawer,
    IconButton,
    List,
    ListItem,
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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [lastMenuId, setLastMenuId] = useState(null)
    const [hasMore, setHasMore] = useState(true)

    const fetchMenuItems = useCallback(async () => {
        if (loading || !hasMore || !storeId) return
        setLoading(true)
        setError(null)
        try {
            const menus = await getMenus(storeId, lastMenuId, 20)
            setMenuItems((prev) => [...prev, ...menus])
            setLastMenuId(menus[menus.length - 1]?.id)
            setHasMore(menus.length === 20)
        } catch (err) {
            setError('메뉴를 불러오는데 실패했습니다')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [storeId, lastMenuId, loading, hasMore])

    useEffect(() => {
        const tableNumber = searchParams.get('tableNumber')
        setTableNumber(tableNumber)

        fetchMenuItems()

        const fetchStoreInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/stores/${storeId}/details`)
                const data = await response.json()
                setStoreName(data.name)
            } catch (error) {
                console.error('가게 정보를 불러오는데 실패했습니다:', error)
            }
        }

        fetchStoreInfo()
    }, [storeId, searchParams, setTableNumber, fetchMenuItems])

    const handleItemClick = (item) => {
        setSelectedItem(item)
        setQuantity(1)
        setDrawerOpen(true)
    }

    console.log(selectedItem)

    const handleAddToCart = () => {
        addToCart({
            menuId: selectedItem.id,
            name: selectedItem.name,
            price: selectedItem.price,
            quantity: quantity,
            imageUrl:
                selectedItem.s3MenuUrl || selectedItem.menuImage?.s3MenuUrl,
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
                            onClick={
                                item.isAvailable
                                    ? () => handleItemClick(item)
                                    : undefined
                            }
                            button={item.isAvailable}
                            divider
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                '&:hover': {
                                    bgcolor: item.isAvailable
                                        ? 'rgba(255, 159, 28, 0.1)'
                                        : 'inherit',
                                },
                                opacity: item.isAvailable ? 1 : 0.5,
                                cursor: item.isAvailable
                                    ? 'pointer'
                                    : 'not-allowed',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexGrow: 1,
                                    mr: 2,
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    {item.name}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="primary"
                                    fontWeight="bold"
                                    gutterBottom
                                >
                                    {new Intl.NumberFormat('ko-KR').format(
                                        item.price
                                    )}
                                    원
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {item.description}
                                </Typography>
                                {!item.isAvailable && (
                                    <Typography
                                        variant="body2"
                                        color="error"
                                        sx={{ mt: 1 }}
                                    >
                                        현재 판매 중지
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ width: 80, height: 80, flexShrink: 0 }}>
                                {(item.s3MenuUrl ||
                                    item.menuImage?.s3MenuUrl) && (
                                    <Avatar
                                        src={
                                            item.s3MenuUrl ||
                                            item.menuImage?.s3MenuUrl
                                        }
                                        alt={item.name}
                                        sx={{ width: '100%', height: '100%' }}
                                        variant="rounded"
                                    />
                                )}
                            </Box>
                        </ListItem>
                    ))}
                </List>
                {loading && <Typography>로딩 중...</Typography>}
                {error && <Typography color="error">{error}</Typography>}
                {hasMore && !loading && (
                    <Button onClick={fetchMenuItems} fullWidth>
                        더 보기
                    </Button>
                )}
                <IconButton
                    color="primary"
                    aria-label="cart"
                    onClick={handleCartClick}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 64,
                        height: 64,
                        boxShadow: 3,
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        },
                    }}
                >
                    <Badge
                        badgeContent={cartItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                        )}
                        color="error"
                        sx={{
                            '& .MuiBadge-badge': {
                                right: -3,
                                top: 3,
                                border: `2px solid ${theme.palette.background.paper}`,
                                padding: '0 4px',
                            },
                        }}
                    >
                        <AddShoppingCartIcon sx={{ fontSize: 28 }} />
                    </Badge>
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
                                {(selectedItem.s3MenuUrl ||
                                    selectedItem.menuImage?.s3MenuUrl) && (
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
                                            image={
                                                selectedItem.s3MenuUrl ||
                                                selectedItem.menuImage
                                                    ?.s3MenuUrl
                                            }
                                            alt={selectedItem.name}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                    </Card>
                                )}
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
                                    {new Intl.NumberFormat('ko-KR').format(
                                        selectedItem.price
                                    )}
                                    원
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
