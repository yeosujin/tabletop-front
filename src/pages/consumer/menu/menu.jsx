import React from 'react'
import { useOutletContext } from 'react-router-dom'
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Typography,
} from '@mui/material'

const MenuPage = () => {
    const data = useOutletContext()

    // 여기서는 data가 배열이라고 가정합니다.
    // 만약 단일 객체라면 [data]로 감싸서 사용하세요.
    const menuItems = Array.isArray(data) ? data : [data]

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                메뉴 목록
            </Typography>
            <Grid container spacing={4}>
                {menuItems.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={item.image_url}
                                alt={item.name}
                            />
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                >
                                    {item.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {item.description}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                >
                                    ₩{item.price.toLocaleString()}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    disabled={!item.is_available}
                                >
                                    {item.is_available ? '주문하기' : '품절'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default MenuPage
