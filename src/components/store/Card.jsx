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
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { deleteStoreAPI } from '../../apis/seller/SellerAPI'

const Card = ({ store, render, onModifyClick }) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const navigate = useNavigate()
    const s3Prefix =
        'https://tabletop-tabletop.s3.ap-northeast-2.amazonaws.com/tabletop/'

    const storeTypeMap = {
        ORDINARY: '상시',
        TEMPORARY: '임시',
    }

    const handleClick = (event) => {
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
        navigate('/sellers/:username/:storeId/menus', { state: { storeId } })
    }

    const deleteStore = async (storeId) => {
        await deleteStoreAPI(storeId)
        render((prevState) => !prevState)
        navigate('/storelist')
    }

    return (
        <MuiCard sx={{ position: 'relative' }}>
            <Link
                to={`${store.storeId}/orders`}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image={
                            s3Prefix + store.s3Url ||
                            'https://via.placeholder.com/140x140?text=No+Image'
                        }
                        alt={store.name}
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
                                size="small"
                            />
                        </Box>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            textAlign="center"
                        >
                            {store.name}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <IconButton
                    aria-label="settings"
                    onClick={handleClick}
                    sx={{
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <MoreVertIcon />
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
        </MuiCard>
    )
}

export default Card
