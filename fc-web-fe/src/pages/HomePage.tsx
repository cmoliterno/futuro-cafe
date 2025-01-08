import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HomeContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
`;

const Title = styled.h1`
  color: #333;
`;

const Description = styled.p`
  color: #666;
`;

const PolicyLink = styled(Link)`
  color: #1a73e8;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const HomePage: React.FC = () => {
    return (
        <HomeContainer>
            <Title>Bem-vindo ao Futuro Café</Title>
            <Description>
                Esta é a página inicial do aplicativo. Aqui você pode acessar diversas funcionalidades relacionadas à gestão do café.
            </Description>
            <Description>
                Navegue pelo menu para explorar as estatísticas, projetos, cultivares e muito mais!
            </Description>
            <Description>
                Para mais informações, consulte nossa <PolicyLink to="/politica-de-privacidade">Política de Privacidade</PolicyLink>.
            </Description>
        </HomeContainer>
    );
};

export default HomePage;
