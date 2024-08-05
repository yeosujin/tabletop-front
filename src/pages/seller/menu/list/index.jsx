import React from 'react';
import styled from 'styled-components';
import { createMenu, deleteMenu, updateMenu } from '../../../../apis/seller/MenuAPI';

const MenuList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MenuItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const MenuImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const ItemName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.p`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ItemDescription = styled.p`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Button = styled.button`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;
`;

const MenuListComponent = ({ menuItems, onEdit, onDelete, isDeleting }) => {
    return (
        <MenuList>
            {menuItems.map((item) => (
                <MenuItem key={item.id}>
                    {item.s3MenuUrl && <MenuImage src={item.s3MenuUrl} alt={item.name} />}
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>{item.price}원</ItemPrice>
                    <ItemDescription>{item.description}</ItemDescription>
                    <ButtonContainer>
                        <Button onClick={() => onEdit(item)}>수정</Button>
                        <DeleteButton onClick={() => onDelete(item.id)} disabled={isDeleting}>
                            {isDeleting ? '삭제 중...' : '삭제'}
                        </DeleteButton>
                    </ButtonContainer>
                </MenuItem>
            ))}
        </MenuList>
    );
};

export default MenuListComponent;