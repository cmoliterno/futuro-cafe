import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { Layout } from 'antd';
// @ts-ignore
import logo from './assets/logo.png';
import './index.css';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // Atualiza o estado de autenticação ao montar o componente
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="header" style={{ height: '80px' }}>
                <div style={{ margin: '0 auto' }}>
                    <img src={logo} alt="Futuro Café Logo" style={{ height: '60px', margin: '0 20px' }} />
                </div>
            </Header>
            <Content style={{ paddingTop: '2px', backgroundColor: '#EEDCC8' }}>
                <Router>
                    <div>
                        <Navbar/>
                        <AppRoutes />
                    </div>
                </Router>
            </Content>
            <Footer className="footer">Futuro Café ©2024</Footer>
        </Layout>
    );
};

export default App;
