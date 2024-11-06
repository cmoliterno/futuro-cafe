import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica se o token está presente

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redireciona para a página de login se não autenticado
  }

  return <>{element}</>; // Renderiza o elemento protegido
};

export default ProtectedRoute;
