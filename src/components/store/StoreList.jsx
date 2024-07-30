import React from 'react';
import Card from './Card.jsx';

const StoreList = ({ stores, render }) => {
 
    return (
        <div className="store-list">
            {stores.map(store => (
                <Card key={store.storeId} store={store} render={render}/>
            ))}
        </div>
    );
};

export default StoreList;
