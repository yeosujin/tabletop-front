import React from 'react';
import { Navigate } from 'react-router-dom';

const isLogin = () => !!localStorage.getItem("accessToken");

const PrivateRoute = ({ children }) => {
    if (!isLogin()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;