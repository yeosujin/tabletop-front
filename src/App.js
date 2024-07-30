import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Layout from './layouts'
import ExamplePage from './pages/example'
import SignInPage from './pages/seller/sign-in'
import StoreListPage from './pages/seller/store/list'
import StoreAddPage from './pages/seller/store/add'
import StoreModifyPage from './pages/seller/store/modify'
import OrderPage from './pages/seller/order'
import MenuPage from './pages/consumer/menu/menu'
import ConsumerLayout from './layouts/consumer'
import CartPage from './pages/consumer/cart'
import { Suspense } from 'react'
import InfoStorePage from './pages/consumer/info-store'
import { CartProvider } from './contexts/cart'
import PaymentPage from './pages/consumer/payment'
import { TableProvider } from './contexts/table-number'
import CompletePage from './pages/consumer/complete'

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null
}

// 보호된 라우트를 위한 컴포넌트
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }
    return children
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '',
                element: <ExamplePage />,
            },
            {
                path: 'login',
                element: <SignInPage />,
            },
            {
                path: 'storelist',
                element: (
                    <ProtectedRoute>
                        <StoreListPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'addstore',
                element: (
                    <ProtectedRoute>
                        <StoreAddPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'modifystore',
                element: (
                    <ProtectedRoute>
                        <StoreModifyPage />
                    </ProtectedRoute>
                ),
            },
            // 더 많은 보호된 라우트를 여기에 추가할 수 있습니다
            {
                path: 'storelist/:storeId/order',
                element: <OrderPage />,
            },
        ],
    },
    {
        path: '/consumer/:storeId',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <ConsumerLayout />
            </Suspense>
        ),
        children: [
            {
                path: 'menu',
                element: <MenuPage />,
            },
            {
                path: 'cart',
                element: <CartPage />,
            },
            {
                path: 'info',
                element: <InfoStorePage />,
            },
            {
                path: 'payment',
                element: <PaymentPage />,
            },
            {
                path: 'complete',
                element: <CompletePage />,
            },
        ],
    },
])

function App() {
    return (
        <TableProvider>
            <CartProvider>
                <RouterProvider router={router} />
            </CartProvider>
        </TableProvider>
    )
}

export default App
