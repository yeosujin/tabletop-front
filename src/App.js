import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Layout from './layouts'
import ExamplePage from './pages/example'
import SignInPage from './pages/vendor/sign-in'
import StoreListPage from './pages/vendor/store/list'

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
])

function App() {
    return <RouterProvider router={router} />
}

export default App
