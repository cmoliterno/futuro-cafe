import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { Layout } from 'antd';
// @ts-ignore
import logo from './assets/logo.png';
import './index.css';
import GlobalStyle from './styles/GlobalStyle';
import UploadNotification from './components/UploadNotification';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // Atualiza o estado de autenticação ao montar o componente
    }, []);

    return (
        <>
            <GlobalStyle />
            <Layout style={{ minHeight: '100vh' }}>
                <Header className="header" style={{ height: '80px' }}>
                    <div style={{ margin: '0 auto' }}>
                        <img src={logo} alt="Futuro Café Logo" style={{ height: '60px', margin: '0 20px' }} />
                    </div>
                </Header>
                <Content style={{ paddingTop: '2px', backgroundColor: '#EEDCC8' }}>
                    <BrowserRouter>
                        <div>
                            <Navbar />
                            <AppRoutes />
                            <UploadNotification />
                        </div>
                    </BrowserRouter>
                </Content>
            </Layout>
        </>
    );
};

export default App;
