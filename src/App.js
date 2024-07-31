import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Layout from './layouts'
import ExamplePage from './pages/example'
import SignInPage from './pages/seller/sign-in'
import StoreListPage from './pages/seller/store/list'
import MenuPage from './pages/consumer/menu/menu'
import ConsumerLayout from './layouts/consumer'
import CartPage from './pages/consumer/cart'
import { Suspense } from 'react'
import InfoStorePage from './pages/consumer/info-store'
import { CartProvider } from './contexts/cart'
import PaymentPage from './pages/consumer/payment'

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
<<<<<<< Updated upstream
                path: 'dashboard',
                element: (
                    <ProtectedRoute>
                        <StoreListPage />
                    </ProtectedRoute>
                ),
=======
                path: 'storelist',
                element: <StoreListPage />,
            },
            {
                path: 'addstore',
                element: <StoreAddPage />,
            },
            {
                path: 'modifystore',
                element: <StoreModifyPage />,
            },
            {
                path: 'sellers/:username/stores/:storeid/orders',
                element: <OrderPage />,
            },
            {
                path: 'sellers/:username/:storeId/menus',
                element: <Menu />,
>>>>>>> Stashed changes
            },
            // 더 많은 보호된 라우트를 여기에 추가할 수 있습니다
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
        ],
    },
])

function App() {
    return (
        <CartProvider>
            <RouterProvider router={router} />
        </CartProvider>
    )
}

export default App
