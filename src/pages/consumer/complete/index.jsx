import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
    Box,
    Button, CircularProgress,
    Container,
    createTheme,
    Paper,
    ThemeProvider,
    Typography,
} from '@mui/material'
import { PaymentAPI } from '../../../apis/seller/PaymentAPI'
import { useEffect, useState } from 'react'

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
    const location = useLocation();
    const navigate = useNavigate();
    const { storeId } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const imp_uid = searchParams.get('imp_uid');
        const merchant_uid = searchParams.get('merchant_uid');

        if (imp_uid && merchant_uid) {
            PaymentAPI.get(`/api/payments/status?imp_uid=${imp_uid}&merchant_uid=${merchant_uid}`)
                .then(response => {
                    setOrderData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Failed to fetch order data:', error);
                    setError('주문 정보를 불러오는데 실패했습니다.');
                    setLoading(false);
                });
        } else {
            setError('결제 정보를 찾을 수 없습니다.');
            setLoading(false);
        }
    }, [location]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error || !orderData) {
        return <Typography>{error || '주문 정보를 찾을 수 없습니다.'}</Typography>;
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
    );
};

export default CompletePage
