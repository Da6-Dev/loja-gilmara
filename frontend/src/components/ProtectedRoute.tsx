import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
    roleRequired?: 'USER' | 'ADMIN';
}

export const ProtectedRoute = ({ children, roleRequired }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    // Se não tem token, manda pro login
    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userStr);

    // Se precisa de ADMIN e o usuário é USER, bloqueia
    if (roleRequired && user.role !== roleRequired) {
        return <div className="text-center mt-10 text-red-600 font-bold">Acesso Negado: Você não tem permissão.</div>;
    }

    return <>{children}</>;
};