import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Box,
    Card as MuiCard,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { deleteStoreAPI } from '../../apis/seller/SellerAPI'

const CardComponent = ({ store, render, onModifyClick }) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const navigate = useNavigate()
    const loginId = localStorage.getItem('id')
    const s3Prefix =
        'https://tabletop-tabletop.s3.ap-northeast-2.amazonaws.com/tabletop/store_image/'

    const storeTypeMap = {
        ORDINARY: '상시',
        TEMPORARY: '임시',
    }

    const handleMenuClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const moveToModifyStore = (storeId) => {
        onModifyClick(storeId)
    }

    const moveToEditMenu = (storeId) => {
        navigate(`/sellers/${loginId}/stores/${storeId}/menus`, { state: { storeId } })
    }

    const deleteStore = async (storeId) => {
        const isConfirmed = window.confirm("정말 삭제하시겠습니까?");

        if (isConfirmed) {
            await deleteStoreAPI(storeId)
            render((prevState) => !prevState)
        }
    }

    return (
        <MuiCard 
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
            <Link
                to={`${store.storeId}/orders`}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image={
                            store.s3Url
                                ? s3Prefix + store.s3Url
                                : 'https://via.placeholder.com/140x140?text=No+Image'
                        }
                        alt={store.name}
                        sx={{
                            objectFit: 'cover',
                            height: '300px',
                            width: '100%',
                            borderRadius: '10px'
                        }}
                        
                    />
                    <CardContent>
                        <Box sx={{ mb: 1 }}>
                            <Chip
                                label={storeTypeMap[store.storeType]}
                                color={
                                    storeTypeMap[store.storeType] === '임시'
                                        ? 'primary'
                                        : 'secondary'
                                }
                                
                                size="medium"
                            />
                        </Box>
                        <Typography
                            variant="h5"
                            component="div"
                            textAlign="center"
                        >
                            {store.name}
                        </Typography>
                    </CardContent>
                    <Box sx={{ position: 'absolute', bottom: 50, right: 3 }}>
                        <IconButton
                            aria-label="settings"
                            onClick={handleMenuClick}
                            sx={{
                                color: 'black',
                                backgroundColor: 'rgba(0,0,0,0)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                }
                            }}
                        >
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MenuItem
                            onClick={() => {
                                handleClose()
                                moveToEditMenu(store.storeId)
                            }}
                        >
                            메뉴 수정
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose()
                                moveToModifyStore(store.storeId)
                            }}
                        >
                            가게 정보 수정
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose()
                                deleteStore(store.storeId)
                            }}
                        >
                            가게 삭제
                        </MenuItem>
                    </Menu>
                </CardActionArea>
            </Link>
        </MuiCard>
    )
}

export default CardComponent
