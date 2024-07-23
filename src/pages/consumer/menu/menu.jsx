import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
    ConsumerMenuCartIcon,
    ConsumerMenuContent,
    ConsumerMenuContentDescription,
    ConsumerMenuContentTitle,
    ConsumerMenuDialBox,
    ConsumerMenuImage,
    ConsumerMenuItem,
    ConsumerMenuList,
    ConsumerMenuWrapper,
} from './styled'
import Grid from '@mui/material/Unstable_Grid2'
import { CardActionArea } from '@mui/material'
import { ShoppingBasket } from '@mui/icons-material'

const MenuPage = () => {
    const data = useOutletContext()
    const menuItems = Array.isArray(data) ? data : [data]

    const navigation = useNavigate()

    const onClickGotoCartPage = () => {
        // TODO
    }

    return (
        <ConsumerMenuList>
            {menuItems.map((item, i) => (
                <ConsumerMenuWrapper key={i}>
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
                </ConsumerMenuWrapper>
            ))}

            <ConsumerMenuDialBox>
                <ConsumerMenuCartIcon
                    icon={<ShoppingBasket />}
                    ariaLabel="goto cart page"
                    onClick={() => navigation('/cart')}
                />
            </ConsumerMenuDialBox>
        </ConsumerMenuList>
    )
}

export default MenuPage
