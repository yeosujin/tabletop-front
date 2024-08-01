import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
    Box,
    Button,
    Container,
    createTheme,
    Paper,
    ThemeProvider,
    Typography,
} from '@mui/material'

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff9f1c',
        },
        background: {
            default: '#fdfcdc',
        },
    },
})

const CompletePage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { storeId } = useParams()
    const orderData = location.state?.orderData

    if (!orderData) {
        return <Typography>주문 정보를 찾을 수 없습니다.</Typography>
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{ p: 3, mt: 4, bgcolor: 'background.default' }}
                >
                    <Typography variant="h4" gutterBottom>
                        주문 완료
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        주문번호: {orderData.waitingNumber}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        총 결제금액: {orderData.totalPrice}원
                    </Typography>
                    <Box mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() =>
                                navigate(`/consumer/${storeId}/menu`)
                            }
                        >
                            메뉴로 돌아가기
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    )
}

export default CompletePage
