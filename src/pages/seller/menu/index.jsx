import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getMenus, createMenu, updateMenu, deleteMenu } from '../../../apis/seller/MenuAPI';
import MenuList from './list';
import MenuAdd from './add';
import MenuModify from './modify';

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

const Error = styled.p`
  color: red;
  margin-bottom: 1rem;
`;

const Menu = () => {
  const { loginId, storeId } = useParams();
  console.log("loginId:", loginId, "storeId:", storeId);
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
    const newValue = name === 'isAvailable' ? value === 'true' : value;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'isAvailable' ? Boolean(newValue) : newValue
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
    const jsonData = {
      ...formData,
      price: Number(formData.price),
      isAvailable: Boolean(formData.isAvailable)
    };

    console.log('Submitting data:', jsonData); // 디버깅용 로그

    formDataToSend.append('menuData', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

    if (image) {
      formDataToSend.append('image', image);
    }

    // FormData 내용 확인을 위한 로그
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
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
      console.error('Error details:', error.response?.data); // 더 자세한 에러 정보
      setError('메뉴 저장에 실패했습니다: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    const itemToDelete = menuItems.find(item => item.id === itemId);
    if (!itemToDelete) return;

    const isConfirmed = window.confirm(`'${itemToDelete.name}'을 삭제하시겠습니까?`);
    if (!isConfirmed) return;

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
    console.log('Editing item:', item);
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

        <MenuList
            menuItems={menuItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
        />

        <MenuAdd
            showModal={showAddModal}
            formData={formData}
            image={image}
            onSubmit={handleSubmit}
            onChange={handleInputChange}
            onImageChange={handleImageChange}
            onClose={() => setShowAddModal(false)}
            isSubmitting={isSubmitting}
        />

        <MenuModify
            showModal={showEditModal}
            formData={formData}
            image={image}
            editImageUrl={editingItemId ? menuItems.find(item => item.id === editingItemId)?.s3MenuUrl : null}
            onSubmit={handleSubmit}
            onChange={handleInputChange}
            onImageChange={handleImageChange}
            onClose={() => setShowEditModal(false)}
            onDelete={() => handleDelete(editingItemId)}
            isSubmitting={isSubmitting}
            isDeleting={isDeleting}
        />

        {error && <Error>{error}</Error>}
        {loading && <p>로딩 중...</p>}
      </Container>
  );
}

export default Menu;