import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation(); // Obtém a localização atual

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, [location]); // Dependência em `location` para verificar quando a rota mudar

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remover token
        setIsAuthenticated(false);
        window.location.href = '/login'; // Redireciona para a página de login
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/" className="navbar-link">Home</Link>
                {isAuthenticated && (
                    <>
                        <Link to="/perfil" className="navbar-link">Perfil</Link>
                        <Link to="/cultivares" className="navbar-link">Cultivares</Link>
                        <Link to="/fazendas" className="navbar-link">Fazendas</Link>
                        <Link to="/talhoes" className="navbar-link">Talhões</Link>
                        <Link to="/projetos" className="navbar-link">Projetos</Link>
                        <Link to="/grupos" className="navbar-link">Grupos</Link>
                        <Link to="/estatisticas" className="navbar-link">Estatísticas</Link>
                        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                    </>
                )}
                {!isAuthenticated && (
                    <Link to="/login" className="navbar-link">Login</Link>
                )}
            </div>
            {isAuthenticated && (
                <button onClick={handleLogout} className="logout-button">Sair</button>
            )}
        </nav>
    );
};

export default Navbar;
