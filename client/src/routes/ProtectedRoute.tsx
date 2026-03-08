import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { ROUTES } from '../utils/constants';
import UnauthorizedPage from '../pages/UnauthorizedPage';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { token, user } = useAppSelector((s) => s.auth);

    if (!token || !user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <UnauthorizedPage />;
    }

    return <>{children}</>;
}
