import React from 'react';
import styled from 'styled-components';

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
    </HomeContainer>
  );
};

export default HomePage;
