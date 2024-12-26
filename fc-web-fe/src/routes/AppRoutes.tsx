import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CadastroPage from '../pages/CadastroPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import TalhoesPage from '../pages/TalhoesPage';
import CultivaresPage from '../pages/CultivaresPage';
import FazendasPage from '../pages/FazendasPage';
import ProjetosPage from '../pages/ProjetosPage';
import EstatisticasPage from '../pages/EstatisticasPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import GruposPage from "../pages/GruposPage";
import ResultadosAnaliseScreen from "../components/ResultadosAnaliseScreen";
import ColetaImagens from "../components/ColetaImagensScreen";
import ComparacaoAnaliseScreen from "../components/ComparacaoAnaliseScreen";
import ComparacaoRapida from "../components/ComparacaoRapida";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />

      {/* Rotas protegidas */}
        <Route path="/talhoes" element={<ProtectedRoute element={<TalhoesPage />} />} />
        <Route path="/cultivares" element={<ProtectedRoute element={<CultivaresPage />} />} />
        <Route path="/fazendas" element={<ProtectedRoute element={<FazendasPage />} />} />
        <Route path="/projetos" element={<ProtectedRoute element={<ProjetosPage />} />} />
        <Route path="/grupos" element={<ProtectedRoute element={<GruposPage />} />} />
        <Route path="/estatisticas" element={<ProtectedRoute element={<EstatisticasPage />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="/coleta-imagens/:talhaoId" element={<ProtectedRoute element={<ColetaImagens />} />} />
        <Route path="/resultados-analise" element={<ProtectedRoute element={<ResultadosAnaliseScreen />} />} />
        <Route path="/comparacao" element={<ProtectedRoute element={<ComparacaoAnaliseScreen />} />} />
        <Route path="/analise-rapida" element={<ProtectedRoute element={<ComparacaoRapida />} />} />
    </Routes>
  );
}

export default AppRoutes;
