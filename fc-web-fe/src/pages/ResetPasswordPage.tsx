import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../services/api'; // Serviço de API configurado
import { useNavigate, useParams } from 'react-router-dom'; // Usando useNavigate e useParams

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
  background-color: #EEDCC8;
  overflow: hidden;
`;

const ResetPasswordContainer = styled.div`
  padding: 40px;
  background-color: #fff;
  max-width: 400px;
  width: 90%;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
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
    border-color: #047502;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px;
  width: 100%;
  background-color: #047502;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  &:hover {
    background-color: #035f02;
    transform: scale(1.05);
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
      text-decoration: underline;
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

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useParams(); // Obtém o token da URL (não é mais match.params)

    const handleResetPassword = async () => {
        if (!token) {
            setError('Token inválido ou expirado.');
            return;
        }

        try {
            const response = await api.resetPassword({ token, newPassword });
            setMessage('Sua senha foi redefinida com sucesso!');
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('Erro ao redefinir a senha. Verifique o token ou tente novamente.');
            setMessage('');
        }
    };

    return (
        <Container>
            <ResetPasswordContainer>
                <Title>Redefinir Senha</Title>
                <Input
                    type="password"
                    value={newPassword}
                    placeholder="Nova Senha"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                {message && <SuccessMessage>{message}</SuccessMessage>}
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Button onClick={handleResetPassword}>Redefinir Senha</Button>
                <LinkText>
                    <a href="/login">Voltar para o login</a>
                </LinkText>
            </ResetPasswordContainer>
        </Container>
    );
};

export default ResetPasswordPage;
