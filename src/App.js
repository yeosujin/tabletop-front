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
                path: 'dashboard',
                element: (
                    <ProtectedRoute>
                        <StoreListPage />
                    </ProtectedRoute>
                ),
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
                path: 'info-store',
                element: <InfoStorePage />,
            },
        ],
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App
