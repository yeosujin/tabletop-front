import React from 'react'
import CardComponent from './CardComponent.jsx'
import Grid from '@mui/material/Unstable_Grid2'

const StoreList = ({ stores, render, onModifyClick }) => {
    return (
        <Grid container spacing={6} sx={{ width: '100%', padding: '5%' }}>
            {stores.map((store) => (
                <Grid lg={3} md={4} sm={6} xs={12} sx={{ padding: '1.5%' }}>
                    <CardComponent
                        key={store.storeId}
                        store={store}
                        render={render}
                        onModifyClick={onModifyClick}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default StoreList
