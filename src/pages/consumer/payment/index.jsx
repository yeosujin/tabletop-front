import React, { useCallback, useEffect, useState } from 'react'
import { useCart } from '../../../contexts/cart'
import { useNavigate, useParams } from 'react-router-dom'
import { useTable } from '../../../contexts/table-number'
import { Box, Button, Container, Paper, Snackbar, Typography } from '@mui/material'
import { PaymentAPI } from '../../../apis/seller/PaymentAPI'

const PaymentPage = () => {
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const { storeId } = useParams();
    const { tableNumber } = useTable();

    useEffect(() => {
        const loadScripts = async () => {
            const loadScript = (src) => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            };

            try {
                await loadScript('https://code.jquery.com/jquery-1.12.4.min.js');
                await loadScript('https://cdn.iamport.kr/js/iamport.payment-1.2.0.js');
                setScriptsLoaded(true);
                console.log('Scripts loaded successfully');
            } catch (error) {
                console.error('Failed to load scripts', error);
                setPaymentStatus('script_error');
                setErrorMessage('결제 스크립트 로딩에 실패했습니다.');
            }
        };

        loadScripts();
    }, []);

    const calculateTotalAmount = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const handlePaymentResult = async (rsp) => {
        if (rsp.success) {
            try {
                const response = await PaymentAPI.post('/api/orders', {
                    imp_uid: rsp.imp_uid,
                    merchant_uid: rsp.merchant_uid,
                    storeId: storeId,
                    tableNumber: tableNumber,
                    orderItems: cartItems.map((item) => ({
                        menuId: item.menuId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    payment: {
                        paymentMethod: rsp.pay_method,
                        transactionId: rsp.imp_uid,
                    },
                });

                clearCart();
                navigate(`/consumer/${storeId}/complete`, {
                    state: { orderData: response.data }
                });
            } catch (error) {
                console.error('Order creation failed:', error);
                setPaymentStatus('order_failure');
                setErrorMessage('주문 처리 중 오류가 발생했습니다.');
            }
        } else {
            console.error('Payment failed', rsp.error_msg);
            setPaymentStatus('failure');
            setErrorMessage(`결제 실패: ${rsp.error_msg}`);
        }
        setIsPaymentProcessing(false);
    };

    const requestPay = useCallback((paymentMethod) => {
        if (!scriptsLoaded) {
            console.error('Scripts not loaded');
            setPaymentStatus('script_error');
            setErrorMessage('결제 스크립트가 로드되지 않았습니다.');
            return;
        }

        const { IMP } = window;
        if (!IMP) {
            console.error('IMP is not loaded');
            setPaymentStatus('imp_error');
            setErrorMessage('결제 모듈이 초기화되지 않았습니다.');
            return;
        }

        console.log('Initializing IMP');
        IMP.init('imp55078373');

        const totalAmount = calculateTotalAmount();

        let pgProvider = '';
        switch (paymentMethod) {
            case 'kakaopay':
                pgProvider = 'kakaopay.TC0ONETIME';
                break;
            case 'tosspay':
                pgProvider = 'tosspay.tosstest';
                break;
            case 'inicis':
                pgProvider = 'html5_inicis.INIpayTest';
                break;
            default:
                console.error('Invalid payment method');
                setErrorMessage('잘못된 결제 방법입니다.');
                return;
        }

        console.log('Requesting payment');
        setIsPaymentProcessing(true);
        IMP.request_pay(
            {
                pg: pgProvider,
                pay_method: 'card',
                merchant_uid: `order_no_${Date.now()}`,
                name: '주문명:결제테스트',
                amount: totalAmount,
                buyer_email: 'test1234@naver.com',
                buyer_name: '구매자이름',
                buyer_tel: '010-1234-5678',
                buyer_addr: '서울특별시 강남구 삼성동',
                buyer_postcode: '123-456',
            },
            handlePaymentResult
        );
    }, [scriptsLoaded, cartItems, storeId, tableNumber, clearCart, navigate]);

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    결제 금액: {calculateTotalAmount().toLocaleString()}원
                </Typography>

                <Box mt={3}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mb: 2,
                            bgcolor: '#FEE500',
                            color: 'black',
                            '&:hover': { bgcolor: '#E6CF00' },
                        }}
                        onClick={() => requestPay('kakaopay')}
                        disabled={
                            !scriptsLoaded ||
                            isPaymentProcessing ||
                            cartItems.length === 0
                        }
                    >
                        카카오페이
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mb: 2,
                            bgcolor: '#3182F6',
                            '&:hover': { bgcolor: '#2B72DE' },
                        }}
                        onClick={() => requestPay('tosspay')}
                        disabled={
                            !scriptsLoaded ||
                            isPaymentProcessing ||
                            cartItems.length === 0
                        }
                    >
                        토스
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mb: 2,
                            bgcolor: '#E10000',
                            '&:hover': { bgcolor: '#C70000' },
                        }}
                        onClick={() => requestPay('inicis')}
                        disabled={
                            !scriptsLoaded ||
                            isPaymentProcessing ||
                            cartItems.length === 0
                        }
                    >
                        KG이니시스
                    </Button>
                </Box>
                {isPaymentProcessing && (
                    <Typography sx={{ mt: 2 }}>
                        결제 창을 확인해주세요. 결제가 완료되면 이 페이지로
                        돌아옵니다.
                    </Typography>
                )}
            </Paper>
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                message={errorMessage}
            />
        </Container>
    );
};

export default PaymentPage;