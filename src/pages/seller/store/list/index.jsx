import React, { useState } from 'react'
import InfiniteScrollComponent from '../../../../components/store/InfiniteScroll'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import StoreAddModal from '../add'
import StoreModifyModal from '../modify'

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
