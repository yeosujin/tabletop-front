import { useCallback, useEffect, useRef } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { getTokenHeaders } from '../../../../apis/seller/SellerAPI'
import { unsubscribeSSE } from '../../../../apis/seller/OrderAPI'

const useSSE = (storeId, addNewOrder) => {
    const eventSourceRef = useRef(null)
    const reconnectTimeoutRef = useRef(null)

    const connectSSE = useCallback(() => {
        const headers = getTokenHeaders()
        const EventSource = EventSourcePolyfill

        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const eventSource = new EventSource(
            `${process.env.API_URL}/api/sse/orders/subscribe/${storeId}`,
            { headers }
        )

        eventSource.onmessage = (event) => {
            const newOrder = JSON.parse(event.data)
            addNewOrder(newOrder)
        }

        eventSource.onerror = (error) => {
            console.error('SSE 에러:', error)
            eventSource.close()
            reconnectTimeoutRef.current = setTimeout(connectSSE, 5000)
        }

        eventSource.onopen = () => {
            console.log('SSE 연결 성공')
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
        }

        eventSourceRef.current = eventSource
    }, [storeId, addNewOrder])

    const handleSSEUnsubscribe = useCallback(async () => {
        try {
            console.log('Unsubscribing from SSE...')
            await unsubscribeSSE(storeId)
            console.log('Successfully unsubscribed from SSE')
        } catch (error) {
            console.error('Failed to unsubscribe from SSE:', error)
        }
    }, [storeId])

    useEffect(() => {
        connectSSE()

        const intervalId = setInterval(() => {
            if (
                eventSourceRef.current &&
                eventSourceRef.current.readyState === EventSource.CLOSED
            ) {
                console.log('SSE 연결이 끊어졌습니다. 재연결 시도 중...')
                connectSSE()
            }
        }, 30000)

        return () => {
            console.log('Component unmounting, closing SSE connection...')
            if (eventSourceRef.current) {
                eventSourceRef.current.close()
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
            clearInterval(intervalId)
            handleSSEUnsubscribe().then(() => {
                console.log('SSE cleanup completed')
            })
        }
    }, [storeId, connectSSE, handleSSEUnsubscribe])

    return null
}

export default useSSE
