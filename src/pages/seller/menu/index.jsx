import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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

const Button = styled.button`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
`;

const AddButton = styled(Button)`
  background-color: #28a745;
  color: white;
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

const Input = styled.input`
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  min-height: 100px;
  font-size: 1rem;
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

const Menu = () => {
  const { username, storeId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', image: null, isAvailable: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastMenuId, setLastMenuId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef(null);

  const fetchMenuItems = useCallback(async () => {
    if (loading || !hasMore || !storeId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/sellers/${username}/${storeId}/menus`, {
        params: { lastMenuId, limit: 20 }
      });
      const newItems = response.data;
      setMenuItems(prev => [...prev, ...newItems]);
      setLastMenuId(newItems[newItems.length - 1]?.id);
      setHasMore(newItems.length === 20);
    } catch (err) {
      setError('메뉴 항목을 불러오는데 실패했습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [username, storeId, lastMenuId, loading, hasMore]);

  useEffect(() => {
    if (storeId) {
      fetchMenuItems();
    }
  }, [fetchMenuItems, storeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = 'cropped.jpeg';
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, 'image/jpeg', 1);
    });
  };

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop);
        setNewItem(prev => ({ ...prev, image: croppedImageUrl }));
        setShowCropModal(false);
      } catch (err) {
        console.error('Error cropping image:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('price', newItem.price);
    formData.append('description', newItem.description);
    formData.append('isAvailable', newItem.isAvailable);
    if (newItem.image) {
      formData.append('image', newItem.image);
    }

    try {
      if (editingItemId) {
        const response = await axios.put(`/api/sellers/${username}/${storeId}/menus/${editingItemId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMenuItems(prev => prev.map(item => item.id === editingItemId ? response.data : item));
        setEditingItemId(null);
      } else {
        const response = await axios.post(`/api/sellers/${username}/${storeId}/menus`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMenuItems(prev => [response.data, ...prev]);
      }
      setNewItem({ name: '', price: '', description: '', image: null, isAvailable: true });
      setShowForm(false);
    } catch (err) {
      setError('메뉴 항목 저장에 실패했습니다');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingItemId) {
      setShowForm(false);
      return;
    }

    setIsDeleting(true);
    setError(null);
    try {
      await axios.delete(`/api/sellers/${username}/${storeId}/menus/${editingItemId}`);
      setMenuItems(prev => prev.filter(item => item.id !== editingItemId));
      setShowForm(false);
      setEditingItemId(null);
    } catch (err) {
      setError('메뉴 항목 삭제에 실패했습니다');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (item) => {
    setNewItem({ ...item, image: item.image });
    setEditingItemId(item.id);
    setShowForm(true);
  };

  return (
      <Container>
        <Title>메뉴 관리</Title>
        <AddButton onClick={() => {setShowForm(true); setEditingItemId(null); setNewItem({ name: '', price: '', description: '', image: null, isAvailable: true });}}>
          + 메뉴 추가
        </AddButton>

        {showForm && (
            <Form onSubmit={handleSubmit}>
              <ImageSection>
                <Input type="file" onChange={handleImageUpload} accept="image/*" />
                {newItem.image && (
                    <>
                      <ImagePreview src={newItem.image} alt="Preview" />
                      <CropButton type="button" onClick={() => setShowCropModal(true)}>
                        이미지 자르기
                      </CropButton>
                    </>
                )}
              </ImageSection>
              <InputSection>
                <Input
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    placeholder="메뉴 이름"
                    required
                />
                <Input
                    type="number"
                    name="price"
                    value={newItem.price}
                    onChange={handleInputChange}
                    placeholder="가격"
                    required
                />
                <Textarea
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    placeholder="설명"
                />
                <ButtonContainer>
                  <SaveButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '저장 중...' : '저장'}
                  </SaveButton>
                  <DeleteButton type="button" onClick={handleDelete} disabled={isDeleting || !editingItemId}>
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </DeleteButton>
                </ButtonContainer>
              </InputSection>
            </Form>
        )}

        {showCropModal && (
            <Modal>
              <ModalContent>
                <ReactCrop
                    src={newItem.image}
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onImageLoaded={(img) => imgRef.current = img}
                    onComplete={(c) => setCompletedCrop(c)}
                />
                <ButtonContainer>
                  <Button onClick={handleCropComplete}>자르기 완료</Button>
                  <Button onClick={() => setShowCropModal(false)}>취소</Button>
                </ButtonContainer>
              </ModalContent>
            </Modal>
        )}

        {error && <Error>{error}</Error>}

        <MenuList>
          {menuItems.map((item) => (
              <MenuItem key={item.id}>
                {item.image && <MenuImage src={item.image} alt={item.name} />}
                <ItemName>{item.name}</ItemName>
                <ItemPrice>{item.price}원</ItemPrice>
                <ItemDescription>{item.description}</ItemDescription>
                <Button onClick={() => handleEdit(item)}>수정</Button>
              </MenuItem>
          ))}
        </MenuList>

        {loading && <p>로딩 중...</p>}
      </Container>
  );
};

export default Menu;