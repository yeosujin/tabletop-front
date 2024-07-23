import React from 'react'
import { useOutletContext } from 'react-router-dom'
import {
    ConsumerMenuContent,
    ConsumerMenuContentDescription,
    ConsumerMenuContentTitle,
    ConsumerMenuImage,
    ConsumerMenuItem,
    ConsumerMenuList,
} from '../../../layouts/consumer/header/styled'
import Grid from '@mui/material/Unstable_Grid2'
import { CardActionArea } from '@mui/material'

const MenuPage = () => {
    const data = useOutletContext()
    const menuItems = Array.isArray(data) ? data : [data]

    return (
        <ConsumerMenuList>
            {menuItems.map((item) => (
                <CardActionArea>
                    <ConsumerMenuItem container>
                        <Grid xs={3}>
                            <ConsumerMenuImage>
                                <img src={item.image_url} alt={item.name} />
                            </ConsumerMenuImage>
                        </Grid>
                        <Grid xs={9}>
                            <ConsumerMenuContent>
                                <ConsumerMenuContentTitle variant="h6">
                                    {item.name}
                                </ConsumerMenuContentTitle>
                                <ConsumerMenuContentDescription variant="body1">
                                    {item.description}
                                </ConsumerMenuContentDescription>
                            </ConsumerMenuContent>
                        </Grid>
                    </ConsumerMenuItem>
                </CardActionArea>
            ))}
        </ConsumerMenuList>
    )
}

export default MenuPage
