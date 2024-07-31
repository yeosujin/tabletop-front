import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import SiteHeader from './layouts/header'
import SiteFooter from './layouts/footer'
import ExamplePage from './pages/example'
import SignInPage from './pages/seller/sign-in'
import StoreListPage from './pages/seller/store/list'
import StoreAddPage from './pages/seller/store/add'
import StoreModifyPage from './pages/seller/store/modify'
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

const router = createBrowserRouter([
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
                path: 'login',
                element: <SignInPage />,
            },
            {
                path: 'dashboard',
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
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
])

function App() {
    return (
        <TableProvider>
            <CartProvider>
                <Suspense fallback={<div>Loading...</div>}>
                    <RouterProvider router={router} />
                </Suspense>
            </CartProvider>
        </TableProvider>
    )
}

export default App
