import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { Chip } from '@mui/material';
import { deleteStoreAPI } from '../../apis/seller/SellerAPI';

const Card = ({ store, render }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    // storeType 변환
    const storeTypeMap = {
        'ORDINARY': '상시',
        'TEMPORARY': '임시'
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const moveToModifyStore = (storeId) => {
        navigate('/modifystore', { state: { storeId } });
    };

    const moveToEditMenu = (storeId) => {
        navigate('/menu', { state: { storeId } });
    };

    const deleteStore = async (storeId) => {
        await deleteStoreAPI(storeId);
        
        render(prevState => !prevState);
        navigate('/storelist');
    };

    return (
        <div className="card">
            {store.image && (
                <div>
                    <img src={store.image.src || '이미지를 등록하세요.'} alt='대표 이미지' width="100" />
                </div>
            )}
            <Chip label={storeTypeMap[store.storeType]} color="primary" />
            <div>
                <IconButton 
                    aria-label="menu"
                    id="fade-button"
                    aria-controls={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="fade-menu"
                    MenuListProps={{
                      'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={() => {
                        handleClose();
                        moveToEditMenu(store.storeId);
                    }}>메뉴 수정</MenuItem>
                    <MenuItem onClick={() => {
                        handleClose();
                        moveToModifyStore(store.storeId);
                    }}>가게 정보 수정</MenuItem>
                    <MenuItem onClick={() => {
                        handleClose();
                        deleteStore(store.storeId);
                    }}>가게 삭제</MenuItem>
                </Menu>
            </div>
            <p>{store.image}</p>
            <h2>{store.name}</h2>
        </div>
    );
};

export default Card;