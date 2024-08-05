import React from 'react';
import { Navigate } from 'react-router-dom';

const isLogin = () => !!localStorage.getItem("accessToken");

const ProtectedRoute = ({ children }) => {
    if (isLogin()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;