import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaLeaf, FaChartLine, FaCalendarAlt, FaCoffee, FaSeedling, 
  FaArrowRight, FaUserAlt, FaCheck, FaChartBar, FaMapMarkedAlt,
  FaMobileAlt, FaCloudSun, FaHandHoldingWater
} from 'react-icons/fa';

// Animações
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Breakpoints para responsividade
const breakpoints = {
  mobile: '576px',
  tablet: '768px',
  laptop: '992px',
  desktop: '1200px'
};

// Estilos
const HomeContainer = styled.div`
  padding: 0;
  background-color: #2C1810;
  min-height: 100vh;
  overflow: hidden;
`;

const Hero = styled.div`
  background: linear-gradient(rgba(44, 24, 16, 0.85), rgba(44, 24, 16, 0.95)), 
              url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80') no-repeat center center;
  background-size: cover;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  color: #EEDCC8;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to top, #2C1810, transparent);
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    min-height: 60vh;
    padding: 50px 15px;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 20px;
  animation: ${fadeIn} 1s ease-out;
  color: #EEDCC8;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 3rem;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  max-width: 800px;
  margin: 0 auto 30px;
  line-height: 1.6;
  animation: ${fadeIn} 1s ease-out 0.3s forwards;
  opacity: 0;
  color: #EEDCC8;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2rem;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
    margin-bottom: 20px;
  }
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 15px 30px;
  background-color: #047502;
  color: #EEDCC8;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  animation: ${fadeIn} 1s ease-out 0.6s forwards;
  opacity: 0;
  
  &:hover {
    background-color: #035802;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  svg {
    margin-left: 10px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
`;

const StatsSection = styled.section`
  background-color: #2C1810;
  padding: 60px 20px;
  position: relative;
  z-index: 1;
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 40px 15px;
  }
`;

const ImageSection = styled.section`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(44, 24, 16, 0.3), rgba(44, 24, 16, 0.3));
    pointer-events: none;
  }
`;

const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  
  @media (max-width: ${breakpoints.laptop}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 20px;
  background: rgba(238, 220, 200, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  h3 {
    font-size: 2.5rem;
    color: #EEDCC8;
    margin-bottom: 10px;
    font-weight: 700;
  }
  
  p {
    color: #EEDCC8;
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 20px;
  background: linear-gradient(135deg, #EEDCC8 0%, #F5E6D3 100%);
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 60px 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #2C1810;
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: #047502;
  }
`;

const FeatureGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  
  @media (max-width: ${breakpoints.laptop}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #047502 0%, #35A853 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #4A2511;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  color: #4A2511;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const BenefitsSection = styled.section`
  padding: 80px 20px;
  background: #2C1810;
  position: relative;
  overflow: hidden;
  
  ${SectionTitle} {
    color: #EEDCC8;
    margin-bottom: 60px;
    
    &:after {
      background-color: #047502;
    }
  }
`;

const BenefitsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  
  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  animation: ${slideIn} 0.6s ease-out forwards;
  opacity: 0;
  background: rgba(238, 220, 200, 0.05);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
  &:nth-child(4) { animation-delay: 0.6s; }
`;

const BenefitIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #047502;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #EEDCC8;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const BenefitContent = styled.div`
  h4 {
    color: #EEDCC8;
    font-size: 1.3rem;
    margin-bottom: 10px;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  p {
    color: #EEDCC8;
    line-height: 1.6;
    opacity: 0.9;
    font-size: 1.1rem;
  }
`;

const CTASection = styled.section`
  background: linear-gradient(rgba(44, 24, 16, 0.9), rgba(44, 24, 16, 0.95)),
              url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80') no-repeat center center fixed;
  background-size: cover;
  padding: 100px 20px;
  color: #EEDCC8;
  text-align: center;
  
  h2 {
    font-size: 3rem;
    margin-bottom: 20px;
    color: #EEDCC8;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    font-weight: 700;
  }
  
  p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto 40px;
    color: #EEDCC8;
    opacity: 0.95;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    line-height: 1.6;
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <Hero>
        <HeroContent>
          <HeroTitle>Futuro Café</HeroTitle>
          <HeroSubtitle>
            Maximize a produtividade da sua fazenda de café com análises avançadas,
            previsões de safra e insights detalhados para o melhor manejo da sua
            lavoura.
          </HeroSubtitle>
          <CTAButton to="/dashboard">
            Ir para o Dashboard <FaArrowRight />
          </CTAButton>
        </HeroContent>
      </Hero>

      <StatsSection>
        <StatsGrid>
          <StatCard>
            <h3>150+</h3>
            <p>Fazendas Atendidas</p>
          </StatCard>
          <StatCard>
            <h3>92%</h3>
            <p>Precisão nas Previsões</p>
          </StatCard>
          <StatCard>
            <h3>300+</h3>
            <p>Análises por Mês</p>
          </StatCard>
          <StatCard>
            <h3>25%</h3>
            <p>Aumento de Produtividade</p>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      <ImageSection>
        <img 
          src="https://images.unsplash.com/photo-1599639668293-2f8fdb0b763c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
          alt="Sacas de café em armazém"
        />
      </ImageSection>

      <FeaturesSection>
        <SectionTitle>Nossos Recursos</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaChartLine />
            </FeatureIcon>
            <FeatureTitle>Análises Avançadas</FeatureTitle>
            <FeatureDescription>
              Acesse análises detalhadas da sua plantação de café, com informações sobre o desenvolvimento
              das plantas, saúde da lavoura, e recomendações específicas para o seu caso.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaCalendarAlt />
            </FeatureIcon>
            <FeatureTitle>Previsão de Safra</FeatureTitle>
            <FeatureDescription>
              Nossos algoritmos avançados analisam diversos fatores para fornecer previsões precisas sobre o
              volume da sua próxima safra, ajudando no planejamento financeiro e operacional.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaCoffee />
            </FeatureIcon>
            <FeatureTitle>Planejamento de Colheita</FeatureTitle>
            <FeatureDescription>
              Determine o melhor momento para a colheita com base na maturação dos frutos,
              maximizando a qualidade e o valor do seu café no mercado.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaMapMarkedAlt />
            </FeatureIcon>
            <FeatureTitle>Gestão de Talhões</FeatureTitle>
            <FeatureDescription>
              Organize sua fazenda em talhões para um gerenciamento mais eficiente, acompanhando
              dados específicos de cada área e identificando oportunidades de melhoria.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaSeedling />
            </FeatureIcon>
            <FeatureTitle>Manejo de Cultivares</FeatureTitle>
            <FeatureDescription>
              Compare o desempenho de diferentes cultivares na sua fazenda, identificando quais apresentam
              melhor produtividade, resistência e qualidade de grãos.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaChartBar />
            </FeatureIcon>
            <FeatureTitle>Dashboard Personalizado</FeatureTitle>
            <FeatureDescription>
              Acesse um painel personalizado com todas as informações relevantes sobre sua lavoura em
              um só lugar, facilitando a tomada de decisões estratégicas.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>

      <BenefitsSection>
        <BenefitsContainer>
          <SectionTitle>Por que escolher o Futuro Café?</SectionTitle>
          <BenefitsList>
            <BenefitItem>
              <BenefitIcon>
                <FaCheck />
              </BenefitIcon>
              <BenefitContent>
                <h4>Tecnologia Avançada</h4>
                <p>Utilizamos inteligência artificial e machine learning para fornecer análises precisas e recomendações personalizadas.</p>
              </BenefitContent>
            </BenefitItem>

            <BenefitItem>
              <BenefitIcon>
                <FaCloudSun />
              </BenefitIcon>
              <BenefitContent>
                <h4>Monitoramento em Tempo Real</h4>
                <p>Acompanhe o desenvolvimento da sua lavoura em tempo real, com alertas e notificações importantes.</p>
              </BenefitContent>
            </BenefitItem>

            <BenefitItem>
              <BenefitIcon>
                <FaMobileAlt />
              </BenefitIcon>
              <BenefitContent>
                <h4>Acesso em Qualquer Lugar</h4>
                <p>Acesse suas informações de qualquer dispositivo, a qualquer momento, com nossa plataforma responsiva.</p>
              </BenefitContent>
            </BenefitItem>

            <BenefitItem>
              <BenefitIcon>
                <FaHandHoldingWater />
              </BenefitIcon>
              <BenefitContent>
                <h4>Suporte Especializado</h4>
                <p>Conte com nossa equipe de especialistas em cafeicultura para tirar dúvidas e receber orientações.</p>
              </BenefitContent>
            </BenefitItem>
          </BenefitsList>
        </BenefitsContainer>
      </BenefitsSection>

      <CTASection>
        <h2>Comece Agora</h2>
        <p>
          Transforme a gestão da sua lavoura de café com nossa plataforma
          inteligente e tome decisões baseadas em dados.
        </p>
        <CTAButton to="/dashboard">
          Acessar Dashboard <FaArrowRight />
        </CTAButton>
      </CTASection>
    </HomeContainer>
  );
};

export default HomePage;
