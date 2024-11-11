import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API
import {Link, useNavigate} from 'react-router-dom'; // Importar useNavigate

const Container = styled.div`
  display: flex; /* Ativa o Flexbox */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
  margin-top: 5%;
  background-color: #EEDCC8; /* Cor de fundo */
  overflow: hidden; /* Remove a rolagem */
`;

const LoginContainer = styled.div`
  padding: 40px;
  background-color: #fff; /* Cor de fundo do card */
  max-width: 400px; /* Largura máxima do card */
  width: 90%; /* Largura mínima do card */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  box-sizing: border-box; /* Inclui padding e bordas nas dimensões */
`;

const Title = styled.h1`
  color: #230C02;
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  &:focus {
    border-color: #047502; /* Cor ao focar */
    outline: none; /* Remove a borda de foco padrão */
  }
`;

const Button = styled.button`
  padding: 10px;
  width: 100%;
  background-color: #047502; /* Cor do botão */
  color: #ffffff; /* Cor do texto do botão */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s; /* Animação suave */
  &:hover {
    background-color: #035f02; /* Cor ao passar o mouse */
    transform: scale(1.05); /* Leve aumento no botão ao passar o mouse */
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 15px;
  color: #230C02;
  a {
    color: #047502;
    text-decoration: none;
    &:hover {
      text-decoration: underline; /* Sublinha ao passar o mouse */
    }
  }
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
            // Salvar o accessToken e refreshToken retornados
            localStorage.setItem('token', response.data.result.accessToken);
            localStorage.setItem('refreshToken', response.data.result.refreshToken);
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
        <Container>
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

                        <LinkText>
                            <Link to="/recuperar-senha">Esqueceu sua senha?</Link>
                        </LinkText>
                    </>
                )}
                <LinkText>
                    <Link to="/cadastro">Cadastre-se!</Link>
                </LinkText>
            </LoginContainer>
        </Container>
    );
};

export default LoginPage;
