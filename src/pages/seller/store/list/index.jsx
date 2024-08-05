import React, { useState } from 'react'
import styled from 'styled-components';
import InfiniteScrollComponent from '../../../../components/store/InfiniteScroll'
import StoreAddModal from '../add'
import StoreModifyModal from '../modify'

const Container = styled.div`
    position: fixed;
    bottom: 75px;
    right: 20px;
    z-index: 1000;
`;

const FloatingAddButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border-radius: calc(45px/2);
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background: #ff9f1c;
  
    &:hover {
        width: 125px;
    }

    &:active {
        transform: translate(2px, 2px);
    }
`;

const Sign = styled.div`
    width: 100%;
    font-size: 2.2em;
    color: white;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    ${FloatingAddButton}:hover & {
        width: 30%;
        padding-left: 15px;
    }
`;

const Text = styled.div`
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 1.4em;
    font-weight: 500;
    transition-duration: 0.3s;

    ${FloatingAddButton}:hover & {
        opacity: 1;
        width: 70%;
        padding-right: 15px;
    }
`;

const StoreListPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false)
    const [selectedStoreId, setSelectedStoreId] = useState(null)
    const [isListChanged, setIsListChanged] = useState(false)
    const loginId = localStorage.getItem('id')

    const handleAddClick = () => {
        setIsAddModalOpen(true)
    }

    const handleModifyClick = (storeId) => {
        setSelectedStoreId(storeId)
        setIsModifyModalOpen(true)
    }

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false)
    }

    const handleCloseModifyModal = () => {
        setIsModifyModalOpen(false)
        setSelectedStoreId(null)
    }

    const handleSubmitSuccess = () => {
        setIsListChanged((prev) => !prev)
    }

    return (
        <div className="StoreListPage">
            <h1>My Stores</h1>
            <InfiniteScrollComponent
                loginId={loginId}
                onModifyClick={handleModifyClick}
                isListChanged={isListChanged}
                setIsListChanged={setIsListChanged}
            />
            <Container>
                <FloatingAddButton
                    aria-label="add"
                    onClick={handleAddClick}
                >
                    <Sign>+</Sign>
                    <Text>등록</Text>
                </FloatingAddButton>
            </Container>
            <StoreAddModal
                open={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSubmit={handleSubmitSuccess}
            />
            <StoreModifyModal
                open={isModifyModalOpen}
                onClose={handleCloseModifyModal}
                storeId={selectedStoreId}
                onSubmit={handleSubmitSuccess}
            />
        </div>
    )
}

export default StoreListPage
