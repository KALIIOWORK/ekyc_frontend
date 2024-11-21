import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
    const role = localStorage.getItem('role');

    return (
        <Route
            {...rest}
            element={
                allowedRoles.includes(role) ? (
                    <Component />
                ) : (
                    <Navigate to="/unauthorized" />
                )
            }
        />
    );
};

export default ProtectedRoute;