import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CadastroPage from '../pages/CadastroPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import TalhoesPage from '../pages/TalhoesPage';
import CultivaresPage from '../pages/CultivaresPage';
import FazendasPage from '../pages/FazendasPage';
import EstatisticasPage from '../pages/EstatisticasPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import ResultadosAnaliseScreen from "../components/ResultadosAnaliseScreen";
import ComparacaoAnaliseScreen from "../components/ComparacaoAnaliseScreen";
import ComparacaoRapida from "../components/ComparacaoRapida";
import PrivacyPolicyScreen from "../pages/PrivacyPolicyScreen";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicyScreen />} />

            {/* Rotas protegidas */}
            <Route path="/talhoes" element={<ProtectedRoute element={<TalhoesPage />} />} />
            <Route path="/cultivares" element={<ProtectedRoute element={<CultivaresPage />} />} />
            <Route path="/fazendas" element={<ProtectedRoute element={<FazendasPage />} />} />
            <Route path="/estatisticas" element={<ProtectedRoute element={<EstatisticasPage />} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
            <Route path="/resultados-analise" element={<ProtectedRoute element={<ResultadosAnaliseScreen />} />} />
            <Route path="/comparacao" element={<ProtectedRoute element={<ComparacaoAnaliseScreen />} />} />
            <Route path="/analise-rapida" element={<ProtectedRoute element={<ComparacaoRapida />} />} />
        </Routes>
    );
}

export default AppRoutes;
