import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const LoginContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  max-width: 400px;
  margin: auto;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
`;

const Button = styled.button`
  padding: 8px 12px;
  width: 100%;
  margin-top: 10px;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: green;
  text-align: center;
`;

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // Criar o hook de navegação

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await api.loginUser({ email, password }); // Chamada de login
            // Salvar o accessToken retornado
            localStorage.setItem('token', response.data.result.accessToken);
            console.log('Token salvo:', response.data.result.accessToken); // Log para verificar
            setSuccess('Login realizado com sucesso!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError('Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <LoginContainer>
            <Title>Login</Title>
            <Input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)} // Atualizando o email
            />
            <Input
                type="password"
                value={password}
                placeholder="Senha"
                onChange={(e) => setPassword(e.target.value)} // Atualizando a senha
            />
            {loading ? <p>Loading...</p> : (
                <>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {success && <SuccessMessage>{success}</SuccessMessage>}
                    <Button onClick={handleLogin}>Entrar</Button>
                </>
            )}
        </LoginContainer>
    );
};

export default LoginPage;
