import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getMenus, createMenu, updateMenu, deleteMenu } from '../../../apis/seller/menuAPI';

import MenuList from './list';
import MenuAdd from './add';
import MenuModify from './modify';

import { TextField, Button as MuiButton } from '@mui/material';

const Container = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
`;


const Form = styled.form`
  display: flex;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const ImageSection = styled.div`
  flex: 1;
  margin-right: 1rem;
`;

const InputSection = styled.div`
  flex: 2;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const SaveButton = styled(Button)`
  background-color: #ff9f1c;
  color: white;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;
  margin-left: 0.5rem;
`;

const Error = styled.p`
  color: red;
  margin-bottom: 1rem;
`;


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

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 1rem;
`;

const CropButton = styled(Button)`
  background-color: #17a2b8;
  color: white;
  margin-bottom: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
`;

const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  input[type='file'] {
    display: none;
  }

  label {
    background-color: #007bff;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  span {
    margin-left: 1rem;
    font-size: 1rem;
  }
`;

const Menu = () => {
  const { storeId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    isAvailable: true
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastMenuId, setLastMenuId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMenuItems = useCallback(async () => {
    if (loading || !hasMore || !storeId) return;
    setLoading(true);
    setError(null);
    try {
      const menus = await getMenus(storeId, lastMenuId, 20);
      setMenuItems(prev => [...prev, ...menus]);
      setLastMenuId(menus[menus.length - 1]?.id);
      setHasMore(menus.length === 20);
    } catch (err) {
      setError('메뉴 항목을 불러오는데 실패했습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [storeId, lastMenuId, loading, hasMore]);

  useEffect(() => {
    if (storeId) {
      fetchMenuItems();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('menuData', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      let response;
      if (editingItemId) {
        response = await updateMenu(storeId, editingItemId, formDataToSend);
        setMenuItems(prev => prev.map(item => item.id === editingItemId ? response : item));
        setShowEditModal(false);
      } else {
        response = await createMenu(storeId, formDataToSend);
        setMenuItems(prev => [response, ...prev]);
        setShowAddModal(false);
      }

      setFormData({ name: '', price: '', description: '', isAvailable: true });
      setImage(null);
    } catch (error) {
      setError('메뉴 저장에 실패했습니다: ' + (error.response?.data?.message || error.message));
      console.error('메뉴 저장 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteMenu(storeId, itemId);
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      if (editingItemId === itemId) {
        setShowEditModal(false);
        setEditingItemId(null);
      }
    } catch (err) {
      setError('메뉴 항목 삭제에 실패했습니다');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description || '',
      isAvailable: item.isAvailable
    });
    setImage(null);
    setEditingItemId(item.id);
    setShowEditModal(true);
  };

  const handleAddMenu = () => {
    setFormData({ name: '', price: '', description: '', isAvailable: true });
    setImage(null);
    setEditingItemId(null);
    setShowAddModal(true);
  };

  return (
    <Container>
      <Title>메뉴 관리</Title>
      <AddButton onClick={handleAddMenu}>+ 메뉴 추가</AddButton>
      <MenuList>
        {menuItems.map((item) => (
          <MenuItem key={item.id}>
            {item.image && <MenuImage src={item.image} alt={item.name} />}
            <ItemName>{item.name}</ItemName>
            <ItemPrice>{item.price}원</ItemPrice>
            <ItemDescription>{item.description}</ItemDescription>
            <ButtonContainer>
              <Button onClick={() => handleEdit(item)}>수정</Button>
              <DeleteButton onClick={() => handleDelete(item.id)} disabled={isDeleting}>
                {isDeleting ? '삭제 중...' : '삭제'}
              </DeleteButton>
            </ButtonContainer>
          </MenuItem>
        ))}
      </MenuList>

      {showAddModal && (
        <Modal>
          <ModalContent>
            <Form onSubmit={handleSubmit}>
              <ImageSection>
                <FileInputContainer>
                  <input type="file" id="fileInput" onChange={handleImageUpload} accept="image/*" />
                  <label htmlFor="fileInput">파일 선택</label>
                  <span>{newItem.image ? newItem.image.name : '선택된 파일 없음'}</span>
                </FileInputContainer>
                {newItem.image && (
                  <>
                    <ImagePreview src={URL.createObjectURL(newItem.image)} alt="Preview" />
                    <CropButton type="button" onClick={() => setShowCropModal(true)}>
                      이미지 자르기
                    </CropButton>
                  </>
                )}
              </ImageSection>
              <InputSection>
                <TextField
                  fullWidth
                  label="메뉴 이름"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="가격"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="설명"
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  margin="normal"
                />
                <ButtonContainer>
                  <MuiButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '저장 중...' : '저장'}
                  </MuiButton>
                  <MuiButton
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAddModal(false);
                    }}
                    variant="contained"
                  >
                    닫기
                  </MuiButton>
                </ButtonContainer>
              </InputSection>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showEditModal && (
        <Modal>
          <ModalContent>
            <Form onSubmit={handleSubmit}>
              <ImageSection>
                <FileInputContainer>
                  <input type="file" id="fileInputEdit" onChange={handleImageUpload} accept="image/*" />
                  <label htmlFor="fileInputEdit">파일 선택</label>
                  <span>{newItem.image ? newItem.image.name : '선택된 파일 없음'}</span>
                </FileInputContainer>
                {(newItem.image || editImageUrl) && (
                  <>
                    <ImagePreview src={newItem.image ? URL.createObjectURL(newItem.image) : editImageUrl} alt="Preview" />
                    <CropButton type="button" onClick={() => setShowCropModal(true)}>
                      이미지 자르기
                    </CropButton>
                  </>
                )}
              </ImageSection>
              <InputSection>
                <TextField
                  fullWidth
                  label="메뉴 이름"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="가격"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="설명"
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  margin="normal"
                />
                <ButtonContainer>
                  <MuiButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '저장 중...' : '저장'}
                  </MuiButton>
                  <MuiButton
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(editingItemId);
                    }}
                    variant="contained"
                    color="secondary"
                    disabled={isDeleting}
                  >
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </MuiButton>
                  <MuiButton
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowEditModal(false);
                      setEditImageUrl(null);
                    }}
                    variant="contained"
                  >
                    닫기
                  </MuiButton>
                </ButtonContainer>
              </InputSection>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showCropModal && (
        <Modal>
          <ModalContent>
            <ReactCrop
              src={newItem.image || editImageUrl}
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onImageLoaded={(img) => imgRef.current = img}
              onComplete={(c) => setCompletedCrop(c)}
            />
            <ButtonContainer>
              <MuiButton type="button" onClick={() => setShowCropModal(false)} variant="contained">
                취소
              </MuiButton>
            </ButtonContainer>
          </ModalContent>
        </Modal>
      )}

      {error && <Error>{error}</Error>}
      {loading && <p>로딩 중...</p>}
    </Container>
  );
}

export default Menu;