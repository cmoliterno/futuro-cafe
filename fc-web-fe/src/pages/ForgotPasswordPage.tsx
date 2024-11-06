import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Importando o serviço de API

const ForgotPasswordContainer = styled.div`
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

const Message = styled.p`
  color: green;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    try {
      // const response = await api.forgotPassword({ email });
      // setMessage('Instruções para redefinição de senha foram enviadas para o seu email.');
      // setError(''); // Limpa mensagens de erro, se houver
      // console.log(response.data);
    } catch (err) {
      setError('Erro ao enviar email. Verifique o email e tente novamente.');
      setMessage(''); // Limpa mensagens de sucesso, se houver
    }
  };

  return (
    <ForgotPasswordContainer>
      <Title>Redefinição de Senha</Title>
      <Input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} // Atualizando o email
      />
      {message && <Message>{message}</Message>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button onClick={handleForgotPassword}>Enviar Instruções</Button>
    </ForgotPasswordContainer>
  );
};

export default ForgotPasswordPage;
