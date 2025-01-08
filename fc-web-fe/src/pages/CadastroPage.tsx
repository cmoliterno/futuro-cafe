import React, { useState } from 'react';
import styled from 'styled-components';
import {Link, useNavigate} from 'react-router-dom'; // Importando o hook para navegação
import api from '../services/api'; // Importando o serviço de API

const CadastroContainer = styled.div`
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

const Description = styled.p`
  color: #666;
  padding-top: 10%;
`;

const PolicyLink = styled(Link)`
  color: #1a73e8;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CadastroPage: React.FC = () => {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState(''); // Adicionando estado para CPF
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // Estado para mensagem de sucesso

    const navigate = useNavigate(); // Usando o hook de navegação

    const handleRegister = async () => {
        try {
            const response = await api.registerUser({
                nomeCompleto,
                email,
                password,
                cpf,
            });

            // Exibe a mensagem de sucesso
            setSuccess('Cadastro realizado com sucesso! Redirecionando...');

            // Redireciona para a tela de Dashboard após 2 segundos
            setTimeout(() => {
                navigate('/dashboard'); // Ajuste conforme o caminho da sua tela de Dashboard
            }, 2000);

            console.log(response.data);
        } catch (err: any) {
            // Acessa a mensagem de erro do back-end, se disponível
            const errorMessage = err.response?.data?.message || 'Houve um problema ao fazer o cadastro. Tente novamente.';
            setError(errorMessage);
        }
    };


    return (
        <CadastroContainer>
            <Title>Cadastro</Title>
            <Input
                type="text"
                value={nomeCompleto}
                placeholder="Nome Completo"
                onChange={(e) => setNomeCompleto(e.target.value)} // Atualizando o nome completo
            />
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
            <Input
                type="text"
                value={cpf}
                placeholder="CPF"
                onChange={(e) => setCpf(e.target.value)} // Atualizando o CPF
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>} {/* Exibindo a mensagem de sucesso */}
            <Button onClick={handleRegister}>Cadastrar</Button>

            <Description>
                Para mais informações, consulte nossa <PolicyLink to="/politica-de-privacidade">Política de Privacidade</PolicyLink>.
            </Description>
        </CadastroContainer>
    );
};

export default CadastroPage;
