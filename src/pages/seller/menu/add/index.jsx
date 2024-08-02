import React, { useState } from 'react';
import styled from 'styled-components';
import { createMenu, deleteMenu, updateMenu } from '../../../../apis/seller/menuAPI';

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  min-height: 100px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 1rem;
`;

const SaveButton = styled(Button)`
  background-color: #28a745;
  color: white;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  margin-bottom: 1rem;
`;

const MenuAdd = ({ showModal, formData, image, onSubmit, onChange, onImageChange, onClose, isSubmitting }) => {
    if (!showModal) return null;

    return (
        <Modal>
            <ModalContent>
                <Form onSubmit={onSubmit}>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="메뉴 이름"
                        required
                    />
                    <Input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={onChange}
                        placeholder="가격"
                        required
                    />
                    <Textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        placeholder="설명"
                    />
                    <Input
                        type="file"
                        onChange={onImageChange}
                        accept="image/*"
                    />
                    {image && (
                        <ImagePreview src={URL.createObjectURL(image)} alt="Preview" />
                    )}
                    <SaveButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? '저장 중...' : '저장'}
                    </SaveButton>
                    <Button type="button" onClick={onClose}>
                        취소
                    </Button>
                </Form>
            </ModalContent>
        </Modal>
    );
};

export default MenuAdd;