import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const StoreName = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const TableNumber = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const MenuList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const MenuItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`;

const MenuImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const MenuInfo = styled.div`
  padding: 10px;
`;

const MenuName = styled.h3`
  margin: 0 0 5px 0;
`;

const MenuPrice = styled.p`
  margin: 0 0 5px 0;
  font-weight: bold;
`;

const MenuDescription = styled.p`
  margin: 0;
  font-size: 14px;
`;

const FloatingCart = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [storeName, setStoreName] = useState('');
  const { storeId } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [storeId]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.length);
  };

  const handleCartClick = () => {
    navigate(`/consumer/${storeId}/cart${tableNumber ? `?table=${tableNumber}` : ''}`);
  };

  const handleStoreInfoClick = () => {
    navigate(`/consumer/${storeId}/info${tableNumber ? `?table=${tableNumber}` : ''}`);
  };

  return (
      <PageContainer>
        <Header>
          <StoreName>
            {storeName} <button onClick={handleStoreInfoClick}>ℹ️</button>
          </StoreName>
          {tableNumber && <TableNumber>No.{tableNumber}</TableNumber>}
        </Header>

        <MenuList>
          {menuItems.map(item => (
              <MenuItem key={item.id} onClick={() => handleAddToCart(item)}>
                <MenuImage src={item.image} alt={item.name} />
                <MenuInfo>
                  <MenuName>{item.name}</MenuName>
                  <MenuPrice>{item.price}원</MenuPrice>
                  <MenuDescription>{item.description}</MenuDescription>
                </MenuInfo>
              </MenuItem>
          ))}
        </MenuList>

        <FloatingCart onClick={handleCartClick}>
          🛒 {cartCount}
        </FloatingCart>
      </PageContainer>
  );
};

export default MenuPage;