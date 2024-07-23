import React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Card = ({ store }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const moveToModifyStore = (storeId) => {
    navigate('/modifystore', { state: { storeId } });
  };


  return (
    <div className="card">
        <Chip label={store.type} color="primary" />
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
              <MenuItem onClick={handleClose}>Edit Menu</MenuItem>
              <MenuItem onClick={() => {
                handleClose();
                moveToModifyStore(13);
              }}>Modify Store</MenuItem>
              <MenuItem onClick={handleClose}>Delete Store</MenuItem>
            </Menu>
        </div>
        <p>{store.image}</p>
        <h2>{store.name}</h2>
    </div>
  );
};

export default Card;

