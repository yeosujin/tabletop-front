import React, { useCallback, useEffect, useState } from 'react'
import { useCart } from '../../../contexts/cart'
import { useNavigate, useParams } from 'react-router-dom'
import { useTable } from '../../../contexts/table-number'
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import {notifyOrder, createOrder } from '../../../apis/seller/PaymentAPI'

const PaymentPage = () => {
    const [scriptsLoaded, setScriptsLoaded] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState(null)
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
    const { cartItems, clearCart } = useCart()
    const navigate = useNavigate()
    const { storeId } = useParams()
    const { tableNumber } = useTable()

    useEffect(() => {
        const loadScripts = async () => {
            const loadScript = (src) => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script')
                    script.src = src
                    script.onload = resolve
                    script.onerror = reject
                    document.head.appendChild(script)
                })
            }

            try {
                await loadScript('https://code.jquery.com/jquery-1.12.4.min.js')
                await loadScript(
                    'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js'
                )
                setScriptsLoaded(true)
                console.log('Scripts loaded successfully')
            } catch (error) {
                console.error('Failed to load scripts', error)
                setPaymentStatus('script_error')
            }
        }

        loadScripts()
    }, [])

    const requestPay = useCallback(
        (paymentMethod) => {
            if (!scriptsLoaded) {
                console.error('Scripts not loaded')
                setPaymentStatus('script_error')
                return
            }

            const { IMP } = window
            if (!IMP) {
                console.error('IMP is not loaded')
                setPaymentStatus('imp_error')
                return
            }

            console.log('Initializing IMP')
            IMP.init('imp55078373') // 가맹점 식별코드

            const totalAmount = calculateTotalAmount()

            let pgProvider = ''
            switch (paymentMethod) {
                case 'kakaopay':
                    pgProvider = 'kakaopay.TC0ONETIME'
                    break
                case 'tosspay':
                    pgProvider = 'tosspay.tosstest'
                    break
                case 'inicis':
                    pgProvider = 'html5_inicis.INIpayTest' // KG이니시스 테스트 모드
                    break
                default:
                    console.error('Invalid payment method')
                    return
            }

            localStorage.setItem('pendingOrder', JSON.stringify({
                storeId,
                tableNumber,
                orderItems: cartItems.map(item => ({
                    menuId: item.menuId,
                    quantity: item.quantity,
                    price: item.price
                }))
            }));

            console.log('Requesting payment')
            setIsPaymentProcessing(true)
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
                    m_redirect_url: `${process.env.REACT_APP_API_URL}/consumer/${storeId}/complete`,
                    escrow: true,
                    vbank_due: 'YYYYMMDD',
                    bypass: {
                        acceptmethod: 'noeasypay',
                    },
                },
                async function (rsp) {
                    console.log('Payment response received', rsp)
                    setIsPaymentProcessing(false)
                    if (rsp.success) {
                        console.log('Payment successful', rsp)
                        try {
                            const orderResult = await sendOrderToServer(rsp)
                            setPaymentStatus('success')
                        } catch (error) {
                            console.error('Order processing failed:', error)
                            setPaymentStatus('order_failure')
                        }
                    } else {
                        console.error('Payment failed', rsp.error_msg)
                        setPaymentStatus('failure')
                    }
                }
            )
        },
        [scriptsLoaded, cartItems]
    )

    const handlePaymentClick = (paymentMethod) => {
        setPaymentStatus(null)
        requestPay(paymentMethod)
    }

    const sendOrderToServer = async (paymentData) => {
        try {
            const orderData = {
                storeId: storeId,
                tableNumber: tableNumber,
                orderItems: cartItems.map((item) => ({
                    menuId: item.menuId,
                    quantity: item.quantity,
                    price: item.price,
                })),
                payment: {
                    paymentMethod: paymentData.pg_provider,
                    transactionId: paymentData.imp_uid,
                },
            }

            const response = await createOrder(orderData)
            console.log('Order sent to server:', response)

            await notifyOrder(storeId, response)

            clearCart()
            navigate(`/consumer/${storeId}/complete`, {
                state: { orderData: response },
            })

            return response
        } catch (error) {
            console.error('Failed to send order to server:', error)
            throw error
        }
    }


    const calculateTotalAmount = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )
    }

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
                        onClick={() => handlePaymentClick('kakaopay')}
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
                            bgcolor: '#3182F6', // 토스 색상 (밝은 파란색)
                            '&:hover': { bgcolor: '#2B72DE' },
                        }}
                        onClick={() => handlePaymentClick('tosspay')}
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
                            bgcolor: '#E10000', // KG이니시스 색상 (빨간색)
                            '&:hover': { bgcolor: '#C70000' },
                        }}
                        onClick={() => handlePaymentClick('inicis')}
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
                {paymentStatus === 'success' && (
                    <Typography sx={{ mt: 2 }}>결제 성공</Typography>
                )}
                {paymentStatus === 'failure' && (
                    <Typography sx={{ mt: 2 }}>결제 실패</Typography>
                )}
                {paymentStatus === 'script_error' && (
                    <Typography sx={{ mt: 2 }}>스크립트 로딩 실패</Typography>
                )}
                {paymentStatus === 'imp_error' && (
                    <Typography sx={{ mt: 2 }}>IMP 초기화 실패</Typography>
                )}
                {paymentStatus === 'order_failure' && (
                    <Typography sx={{ mt: 2 }}>주문 처리 실패</Typography>
                )}
            </Paper>
        </Container>
    )
}
export default PaymentPage
