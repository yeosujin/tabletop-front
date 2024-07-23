import React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Card from './Card.jsx';

const StoreList = ({ stores }) => {
    return (
        <div className="store-list">
            {stores.map(store => (
                <Card key={store.id} store={store} />
            ))}
            <Fab color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </div>
        
    );
};

export default StoreList;
