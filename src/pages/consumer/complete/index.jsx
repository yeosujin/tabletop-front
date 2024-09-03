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
import { useEffect, useState } from 'react'
import { createOrder } from '../../../apis/seller/PaymentAPI'

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
        const createOrderFromLocalStorage = async () => {
            const searchParams = new URLSearchParams(location.search);
            const imp_uid = searchParams.get('imp_uid');
            const merchant_uid = searchParams.get('merchant_uid');

            if (imp_uid && merchant_uid) {
                try {
                    const pendingOrderString = localStorage.getItem('pendingOrder');
                    if (!pendingOrderString) {
                        throw new Error('주문 정보를 찾을 수 없습니다.');
                    }
                    const pendingOrder = JSON.parse(pendingOrderString);

                    const orderRequest = {
                        ...pendingOrder,
                        payment: {
                            paymentMethod: 'CARD', // 또는 적절한 결제 방법
                            transactionId: imp_uid
                        }
                    };

                    const response = await createOrder(orderRequest);
                    setOrderData(response);
                    localStorage.removeItem('pendingOrder'); // 주문 생성 후 localStorage 정보 삭제
                } catch (err) {
                    console.error('Failed to create order:', err);
                    setError('주문 생성에 실패했습니다.');
                }
            } else {
                setError('결제 정보를 찾을 수 없습니다.');
            }
            setLoading(false);
        };

        createOrderFromLocalStorage();
    }, [location, storeId]);

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

export default CompletePage;