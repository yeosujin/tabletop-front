import { useCallback, useEffect, useRef, useState } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { getTokenHeaders } from '../../../../apis/seller/SellerAPI'
import { unsubscribeSSE } from '../../../../apis/seller/OrderAPI'

const useSSE = (storeId, onNewOrder) => {
    const [isConnected, setIsConnected] = useState(false);
    const eventSourceRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const retryCountRef = useRef(0);
    const MAX_RETRY_COUNT = 5;

    const connectSSE = useCallback(() => {
        const headers = getTokenHeaders();
        const EventSource = EventSourcePolyfill;

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const apiUrl = process.env.REACT_APP_API_URL || 'http://3.37.149.248:80';
        const sseUrl = `${apiUrl}/api/sse/orders/subscribe/${storeId}`;

        console.log(`Attempting to connect to SSE. URL: ${sseUrl}`);

        const eventSource = new EventSource(sseUrl, {
            headers,
            withCredentials: true
        });

        eventSource.onmessage = (event) => {
            console.log('Received SSE message:', event.data);
            try {
                const newOrder = JSON.parse(event.data);
                onNewOrder(newOrder);
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            eventSource.close();
            setIsConnected(false);

            if (retryCountRef.current < MAX_RETRY_COUNT) {
                const reconnectDelay = Math.min(1000 * 2 ** retryCountRef.current, 30000);
                console.log(`Attempting to reconnect in ${reconnectDelay}ms. Retry count: ${retryCountRef.current + 1}`);
                reconnectTimeoutRef.current = setTimeout(() => {
                    retryCountRef.current++;
                    connectSSE();
                }, reconnectDelay);
            } else {
                console.error('Max retry count reached. Stopping reconnection attempts.');
            }
        };

        eventSource.onopen = () => {
            console.log('SSE connection opened successfully');
            setIsConnected(true);
            retryCountRef.current = 0;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };

        eventSourceRef.current = eventSource;
    }, [storeId, onNewOrder]);

    const cleanupSSE = useCallback(() => {
        console.log('Cleaning up SSE connection...');
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        setIsConnected(false);
        unsubscribeSSE(storeId).catch(error => {
            console.error('Error unsubscribing from SSE:', error);
        });
    }, [storeId]);

    useEffect(() => {
        connectSSE();
        return cleanupSSE;
    }, [connectSSE, cleanupSSE]);

    return isConnected;
};

export default useSSE;