import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API

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

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.authenticateUser({ email, password });
      // Aqui você pode salvar o token ou fazer redirecionamento
      console.log(response.data);
      // Redirecionar ou fazer alguma ação após login
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
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
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button onClick={handleLogin}>Entrar</Button>
    </LoginContainer>
  );
};

export default LoginPage;
