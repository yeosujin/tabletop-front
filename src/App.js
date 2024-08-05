import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import { createTheme, ThemeProvider } from '@mui/material'
import { CartProvider } from './contexts/cart'
import { TableProvider } from './contexts/table-number'
import ProtectedRoute from './components/route/ProtectedRoute';
import PrivateRoute from './components/route/PrivateRoute'
import SiteHeader from './layouts/header'
import SiteFooter from './layouts/footer'
import ConsumerLayout from './layouts/consumer'
import SignInPage from './pages/seller/sign-in'
import SignUpPage from './pages/seller/sign-up'
import PasswordPage from './pages/seller/sign-in/password'
import StoreListPage from './pages/seller/store/list'
import OrderPage from './pages/seller/order'
import Menu from './pages/seller/menu'
import MyProfilePage from './pages/seller/profile'
import MyProfileModifyPage from './pages/seller/profile/modify'
import Dashboard from './pages/seller/sales/pages/dashboard'
import DailyComparison from './pages/seller/sales/charts/dailycomparison'
import MenuSales from './pages/seller/sales/charts/menusales'
import Monthly from './pages/seller/sales/charts/monthly'
import Weekly from './pages/seller/sales/charts/weekly'
import WeeklyDaily from './pages/seller/sales/charts/weekly-daily'
import MenuPage from './pages/consumer/menu'
import CartPage from './pages/consumer/cart'
import InfoStorePage from './pages/consumer/info-store'
import PaymentPage from './pages/consumer/payment'
import CompletePage from './pages/consumer/complete'
import ErrorBoundary from './components/ErrorBoundary'

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
        path: '/',
        element: (
            <ProtectedRoute>
                <SignInPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        element: <SignInPage />,
    },
    {
        path: '/signup',
        element: <SignUpPage />,
    },
    {
        path: '/password',
        element: <PasswordPage />,
    },
    {
        path: 'sellers/:loginId',
        element: <Layout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: 'profile',
                children: [
                    {
                        index: true,
                        element: (
                            <PrivateRoute>
                                <MyProfilePage />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: 'modify',
                        element: (
                            <PrivateRoute>
                                <MyProfileModifyPage />
                            </PrivateRoute>
                        ),
                    },
                ]
            },
            {
                path: 'stores',
                children: [
                    {
                        index: true,
                        element: (
                            <PrivateRoute>
                                <StoreListPage />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: ':storeId',
                        children: [
                            {
                                path: 'menus',
                                element: (
                                    <PrivateRoute>
                                        <Menu />
                                    </PrivateRoute>
                                ),
                            },
                            {
                                path: 'orders',
                                element: (
                                    <PrivateRoute>
                                        <OrderPage />
                                    </PrivateRoute>
                                )
                            },
                            {
                                path: 'charts',
                                element: (
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                ),
                                children: [
                                    {
                                        path: '?type=menu',
                                        element: <MenuSales />,
                                    },
                                    {
                                        path: '?type=yesterday',
                                        element: <DailyComparison />,
                                    },
                                    {
                                        path: '?type=day',
                                        element: <WeeklyDaily />,
                                    },
                                    {
                                        path: '?type=week',
                                        element: <Weekly />,
                                    },
                                    {
                                        path: '?type=month',
                                        element: <Monthly />,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: 'consumer/:storeId',
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
