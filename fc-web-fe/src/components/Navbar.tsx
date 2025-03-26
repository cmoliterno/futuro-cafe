import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background-color: var(--color-primary);
  padding: 0;
  color: white;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--color-background);
  letter-spacing: 0.5px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 8px;
  flex-grow: 1;
  justify-content: center;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 10px 0;
    -ms-overflow-style: none;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const NavLink = styled(Link)`
  color: var(--color-background);
  text-decoration: none;
  padding: 10px 15px;
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: var(--font-size-sm);
  white-space: nowrap;
  
  &:hover {
    background-color: var(--color-primary-light);
    color: white;
    transform: translateY(-2px);
  }
  
  &.active {
    background-color: var(--color-secondary);
    color: white;
    box-shadow: var(--shadow-sm);
  }
`;

const LogoutButton = styled.button`
  background-color: var(--color-accent);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--color-accent-dark);
    transform: translateY(-2px);
  }
`;

const Navbar: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    const isActive = (path: string) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <NavbarContainer>
            <NavbarContent>
                <Logo>Futuro Café</Logo>
                <NavLinks>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/" className={isActive("/")}>Home</NavLink>
                            <NavLink to="/cultivares" className={isActive("/cultivares")}>Cultivares</NavLink>
                            <NavLink to="/fazendas" className={isActive("/fazendas")}>Fazendas</NavLink>
                            <NavLink to="/talhoes" className={isActive("/talhoes")}>Talhões</NavLink>
                            <NavLink to="/resultados-analise" className={isActive("/resultados-analise")}>Análises</NavLink>
                            <NavLink to="/comparacao" className={isActive("/comparacao")}>Comparação</NavLink>
                            <NavLink to="/estatisticas" className={isActive("/estatisticas")}>Estatísticas</NavLink>
                            <NavLink to="/dashboard" className={isActive("/dashboard")}>Dashboard</NavLink>
                            <NavLink to="/analise-rapida" className={isActive("/analise-rapida")}>Análise Rápida</NavLink>
                        </>
                    )}
                    {!isAuthenticated && (
                        <NavLink to="/login" className={isActive("/login")}>Login</NavLink>
                    )}
                </NavLinks>
                {isAuthenticated && (
                    <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
                )}
            </NavbarContent>
        </NavbarContainer>
    );
};

export default Navbar;
