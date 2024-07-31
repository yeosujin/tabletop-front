import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../../contexts/cart';
import { useTable } from '../../../contexts/table-number';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [storeName, setStoreName] = useState('');
  const { storeId, tableNumber } = useParams();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const { setTableNumber } = useTable();

  useEffect(() => {
    const tableNumber = searchParams.get('tableNumber');
    setTableNumber(tableNumber);
    console.log('Table Number:', tableNumber);

    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`/api/stores/${storeId}/menus`);
        setMenuItems(response.data);
      } catch (error) {
        console.error('메뉴를 불러오는데 실패했습니다:', error);
      }
    };

    const fetchStoreInfo = async () => {
      try {
        const response = await axios.get(`/api/stores/${storeId}`);
        setStoreName(response.data.name);
      } catch (error) {
        console.error('가게 정보를 불러오는데 실패했습니다:', error);
      }
    };

    fetchMenuItems();
    fetchStoreInfo();
  }, [storeId, searchParams, setTableNumber]);

  const handleAddToCart = (item) => {
    addToCart({
      menuId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
  };

  const handleCartClick = () => {
    navigate(`/consumer/${storeId}/cart`);
  };

  return (
      <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {storeName}
        </Typography>
        <Grid container spacing={3}>
          {menuItems.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardMedia
                      component="img"
                      height="140"
                      image={item.image}
                      alt={item.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>
                      {item.price}원
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                        size="small"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => handleAddToCart(item)}
                    >
                      담기
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
          ))}
        </Grid>
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
            }}
        >
          <AddShoppingCartIcon />
          <Typography variant="badge" sx={{ ml: 1 }}>
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </Typography>
        </IconButton>
      </Box>
  );
};

export default MenuPage;