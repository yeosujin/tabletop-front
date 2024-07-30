import React, { useCallback, useEffect, useState } from 'react'
import { useCart } from '../../../contexts/cart'
import { useParams } from 'react-router-dom'
import { useTable } from '../../../contexts/table-number'
import axios from 'axios'

const PaymentPage = () => {
    const [scriptsLoaded, setScriptsLoaded] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState(null)
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
    const { cartItems } = useCart()

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

    const calculateTotalAmount = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )
    }

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
                    m_redirect_url: '{모바일에서 결제 완료 후 리디렉션 될 URL}',
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
                            // 여기서 주문 완료 후 추가 작업을 수행할 수 있습니다 (예: 장바구니 비우기, 주문 완료 페이지로 이동 등)
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
                storeId: storeId, // 실제 스토어 ID로 변경해주세요
                tableNumber: tableNumber, // 테이블 번호, 필요에 따라 변경하세요
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

            console.log('order Data :' + JSON.stringify(orderData))

            const response = await axios.post(
                'http://localhost:8080/api/orders/',
                orderData
            )
            console.log('Order sent to server:', response.data)

            // SSE를 통해 주방에 알림 보내기
            await axios.post(
                `http://localhost:8080/api/sse/notify/${orderData.storeId}`,
                response.data
            )
            console.log('SSE notification sent')

            return response.data
        } catch (error) {
            console.error('Failed to send order to server:', error)
            throw error
        }
    }

    return (
        <div>
            <h1>결제 페이지</h1>

            <h2>선택된 항목</h2>
            <ul>
                {cartItems.map((item, index) => (
                    <li key={index}>
                        메뉴 ID: {item.menuId}, 수량: {item.quantity}, 가격:{' '}
                        {item.price * item.quantity}원
                    </li>
                ))}
            </ul>
            <p>총 결제 금액: {calculateTotalAmount()}원</p>

            <button
                onClick={() => handlePaymentClick('kakaopay')}
                disabled={
                    !scriptsLoaded ||
                    isPaymentProcessing ||
                    cartItems.length === 0
                }
            >
                카카오페이로 결제하기
            </button>
            <button
                onClick={() => handlePaymentClick('tosspay')}
                disabled={
                    !scriptsLoaded ||
                    isPaymentProcessing ||
                    cartItems.length === 0
                }
            >
                토스로 결제하기
            </button>
            <button
                onClick={() => handlePaymentClick('inicis')}
                disabled={
                    !scriptsLoaded ||
                    isPaymentProcessing ||
                    cartItems.length === 0
                }
            >
                KG이니시스로 결제하기
            </button>

            {isPaymentProcessing && (
                <p>
                    결제 창을 확인해주세요. 결제가 완료되면 이 페이지로
                    돌아옵니다.
                </p>
            )}
            {paymentStatus === 'success' && <p>결제 성공</p>}
            {paymentStatus === 'failure' && <p>결제 실패</p>}
            {paymentStatus === 'script_error' && <p>스크립트 로딩 실패</p>}
            {paymentStatus === 'imp_error' && <p>IMP 초기화 실패</p>}
            {paymentStatus === 'order_failure' && <p>주문 처리 실패</p>}
        </div>
    )
}

export default PaymentPage
