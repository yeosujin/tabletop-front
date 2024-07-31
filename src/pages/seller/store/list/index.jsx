import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScrollComponent from '../../../../components/store/InfiniteScroll';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const StoreListPage = () => {
    const navigate = useNavigate();
    const loginId = 'YH'; // 임시

    const handleAddClick = () => {
        navigate('/addstore');
    };

    return (
        <div className="StoreListPage">
            <h1>My Stores</h1>
            <InfiniteScrollComponent loginId={loginId} />
            <Fab color="primary" aria-label="add" onClick={handleAddClick}>
                <AddIcon />
            </Fab>
        </div>
    );
};

export default StoreListPage;


