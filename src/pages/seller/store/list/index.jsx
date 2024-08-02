import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScrollComponent from '../../../../components/store/InfiniteScroll'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import StoreAddModal from '../add'

const StoreListPage = () => {
    const navigate = useNavigate()
    const loginId = localStorage.getItem('id')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleAddClick = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleSubmitSuccess = () => {
        // 가게 목록을 새로고침하는 로직을 여기에 추가
        // 예: InfiniteScrollComponent를 리렌더링하거나 데이터를 다시 불러오는 등
    }

    return (
        <div className="StoreListPage">
            <h1>My Stores</h1>
            <InfiniteScrollComponent loginId={loginId} />
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleAddClick}
                style={{
                    position: 'fixed',
                    bottom: '75px',
                    right: '20px',
                    zIndex: 1000,
                }}
            >
                <AddIcon />
            </Fab>
            <StoreAddModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitSuccess}
            />
        </div>
    )
}

export default StoreListPage
