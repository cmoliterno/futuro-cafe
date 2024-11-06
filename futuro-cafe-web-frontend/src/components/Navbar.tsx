// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#333' }}>
      <div>
        <Link to="/" style={{ color: '#fff', margin: '0 1rem' }}>Home</Link>
        {isAuthenticated && (
          <>
            <Link to="/perfil" style={{ color: '#fff', margin: '0 1rem' }}>Perfil</Link>
            <Link to="/cultivares" style={{ color: '#fff', margin: '0 1rem' }}>Cultivares</Link>
            <Link to="/fazendas" style={{ color: '#fff', margin: '0 1rem' }}>Fazendas</Link>
            <Link to="/talhoes" style={{ color: '#fff', margin: '0 1rem' }}>Talhões</Link>
            <Link to="/projetos" style={{ color: '#fff', margin: '0 1rem' }}>Projetos</Link>
            <Link to="/estatisticas" style={{ color: '#fff', margin: '0 1rem' }}>Estatísticas</Link>
            <Link to="/dashboard" style={{ color: '#fff', margin: '0 1rem' }}>Dashboard</Link>
          </>
        )}
        {!isAuthenticated && (
          <>
            <Link to="/login" style={{ color: '#fff', margin: '0 1rem' }}>Login</Link>
            <Link to="/cadastro" style={{ color: '#fff', margin: '0 1rem' }}>Cadastro</Link>
            <Link to="/recuperar-senha" style={{ color: '#fff', margin: '0 1rem' }}>Esqueci a Senha</Link>
          </>
        )}
      </div>
      {isAuthenticated && (
        <button
          onClick={() => {
            localStorage.removeItem('token'); // Logout action
            window.location.reload(); // Reload to update UI
          }}
          style={{ backgroundColor: '#f00', color: '#fff', border: 'none', padding: '0.5rem 1rem' }}
        >
          Sair
        </button>
      )}
    </nav>
  );
};

export default Navbar;
