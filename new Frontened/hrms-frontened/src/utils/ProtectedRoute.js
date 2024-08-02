// ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { role, isAuthenticated } = useSelector(state => state.auth);

    if (!isAuthenticated || !allowedRoles.includes(role)) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;
