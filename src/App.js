import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import SiteHeader from './layouts/header'
import SiteFooter from './layouts/footer'
import ExamplePage from './pages/example'
import SignInPage from './pages/seller/sign-in'
import SignUpPage from './pages/seller/sign-up'
import PasswordPage from './pages/seller/sign-in/password'
import StoreListPage from './pages/seller/store/list'
import OrderPage from './pages/seller/order'
import MenuPage from './pages/consumer/menu'
import ConsumerLayout from './layouts/consumer'
import CartPage from './pages/consumer/cart'
import { Suspense } from 'react'
import InfoStorePage from './pages/consumer/info-store'
import { CartProvider } from './contexts/cart'
import PaymentPage from './pages/consumer/payment'
import { TableProvider } from './contexts/table-number'
import ErrorBoundary from './components/ErrorBoundary'
import Menu from './pages/seller/menu'
import MyProfilePage from './pages/seller/profile'
import MyProfileModifyPage from './pages/seller/profile/modify'
import CompletePage from './pages/consumer/complete'
import { createTheme, ThemeProvider } from '@mui/material'
import Dashboard from './pages/seller/sales/pages/dashboard'
import ProtectedRoute from './components/route/ProtectedRoute';
import PrivateRoute from './components/route/PrivateRoute'

const NotFound = () => <h1>404 - 페이지를 찾을 수 없습니다.</h1>

// Layout 컴포넌트 정의
const Layout = () => (
    <div
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
        <SiteHeader />
        <main style={{ flex: 1 }}>
            <Outlet />
        </main>
        <SiteFooter />
    </div>
)

const theme = createTheme({
    palette: {
        primary: { main: '#ff9f1c' },
        secondary: { main: '#1c7cff' },
        background: { default: '#fdfcdc' },
    },
    components: {
        MuiButton: {
            defaultProps: {
                color: 'primary',
                style: {
                    color: 'white',
                },
            },
        },
    },
})

const router = createBrowserRouter([
    {
        path: 'login',
        element: (
            <ProtectedRoute>
              <SignInPage />
            </ProtectedRoute>
        ),
    },
    {
        path: 'signup',
        element: <SignUpPage />,
    },
    {
        path: 'password',
        element: <PasswordPage />,
    },
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <ExamplePage />,
            },

            {
                path: 'storelist',
                element: (
                    <PrivateRoute>
                        <StoreListPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'storelist/:storeid/orders',
                element: (
                    <PrivateRoute>
                        <OrderPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'sellers/:loginId/:storeId/menus',
                element: (
                    <PrivateRoute>
                        <Menu />
                    </PrivateRoute>
                ),
            },
            {
                path: 'sellers/:loginId/profile',
                element: (
                    <PrivateRoute>
                        <MyProfilePage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'sellers/:loginId/profile/modify',
                element: (
                    <PrivateRoute>
                        <MyProfileModifyPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'sellers/:loginId/stores/:storeId/charts',
                element: (
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                ),
            },
        ],
    },
    {
        path: '/consumer/:storeId',
        element: <ConsumerLayout />,
        errorElement: <ErrorBoundary />,
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
                path: 'details',
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
    {
        path: '*',
        element: <NotFound />,
    },
])

function App() {
    return (
        <ThemeProvider theme={theme}>
            <TableProvider>
                <CartProvider>
                    <Suspense fallback={<div>Loading...</div>}>
                        <RouterProvider router={router} />
                    </Suspense>
                </CartProvider>
            </TableProvider>
        </ThemeProvider>
    )
}

export default App
