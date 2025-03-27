import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf, FaChartLine, FaCalendarAlt, FaCoffee, FaSeedling, FaArrowRight, FaUserAlt } from 'react-icons/fa';

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
  background-color: #EEDCC8;
  min-height: calc(100vh - 80px);
`;

const Hero = styled.div`
  background: linear-gradient(rgba(35, 12, 2, 0.7), rgba(35, 12, 2, 0.7)), 
              url('https://images.unsplash.com/photo-1599999905374-2c586d9596e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80') no-repeat center center;
  background-size: cover;
  padding: 80px 20px;
  color: white;
  text-align: center;
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 50px 15px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  animation: ${fadeIn} 1s ease-out;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 2.5rem;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  max-width: 800px;
  margin: 0 auto 30px;
  line-height: 1.5;
  animation: ${fadeIn} 1s ease-out 0.3s forwards;
  opacity: 0;
  
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.2rem;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
    margin-bottom: 20px;
  }
`;

const FeaturesSection = styled.section`
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 40px 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  color: #4A2511;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);
  
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
  
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.8rem;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.5rem;
    margin-bottom: 30px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
  
  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 20px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: #047502;
  margin-bottom: 20px;
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2rem;
    margin-bottom: 15px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #4A2511;
  margin-bottom: 15px;
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const CTASection = styled.section`
  background-color: #047502;
  padding: 60px 20px;
  color: white;
  text-align: center;
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 40px 15px;
  }
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 2rem;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 30px;
  line-height: 1.5;
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1rem;
    margin-bottom: 20px;
  }
`;

const Button = styled.button`
  background-color: white;
  color: #047502;
  border: none;
  border-radius: 30px;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const TestimonialSection = styled.section`
  padding: 60px 20px;
  background-color: #f9f5f1;
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 40px 15px;
  }
`;

const TestimonialTitle = styled.h2`
  font-size: 2.2rem;
  color: #4A2511;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);
  
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
  
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.8rem;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.5rem;
    margin-bottom: 30px;
    
    &:after {
      width: 60px;
      bottom: -10px;
    }
  }
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const TestimonialCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 20px;
  }
`;

const TestimonialText = styled.p`
  color: #666;
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 20px;
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
    margin-bottom: 15px;
  }
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
  color: #4A2511;
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const Footer = styled.footer`
  background-color: #230C02;
  color: white;
  padding: 30px 20px;
  text-align: center;
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: 20px 15px;
  }
`;

const FooterText = styled.p`
  margin-bottom: 15px;
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
`;

const FooterLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin: 0 10px;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
    margin: 0 5px;
  }
`;

const HomePage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Verificar se o usuário está autenticado
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);
    
    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };
    
    return (
        <HomeContainer>
            <Hero>
                <HeroTitle>Futuro Café</HeroTitle>
                <HeroSubtitle>
                    Maximize a produtividade da sua fazenda de café com análises avançadas,
                    previsões de safra e insights detalhados para o melhor manejo da sua lavoura.
                </HeroSubtitle>
                <Button onClick={handleGetStarted}>
                    {isAuthenticated ? 'Ir para o Dashboard' : 'Começar Agora'} <FaArrowRight />
                </Button>
            </Hero>
            
            <FeaturesSection>
                <SectionTitle>Nossos Recursos</SectionTitle>
                <FeatureGrid>
                    <FeatureCard>
                        <FeatureIcon><FaChartLine /></FeatureIcon>
                        <FeatureTitle>Análises Avançadas</FeatureTitle>
                        <FeatureDescription>
                            Acesse análises detalhadas da sua plantação de café, 
                            com informações sobre o desenvolvimento das plantas, saúde da lavoura,
                            e recomendações específicas para o seu caso.
                        </FeatureDescription>
                    </FeatureCard>
                    
                    <FeatureCard>
                        <FeatureIcon><FaCalendarAlt /></FeatureIcon>
                        <FeatureTitle>Previsão de Safra</FeatureTitle>
                        <FeatureDescription>
                            Nossos algoritmos avançados analisam diversos fatores para fornecer
                            previsões precisas sobre o volume da sua próxima safra, ajudando
                            no planejamento financeiro e operacional.
                        </FeatureDescription>
                    </FeatureCard>
                    
                    <FeatureCard>
                        <FeatureIcon><FaCoffee /></FeatureIcon>
                        <FeatureTitle>Planejamento de Colheita</FeatureTitle>
                        <FeatureDescription>
                            Determine o melhor momento para a colheita com base na maturação dos frutos,
                            maximizando a qualidade e o valor do seu café no mercado.
                        </FeatureDescription>
                    </FeatureCard>
                </FeatureGrid>
                
                <FeatureGrid style={{ marginTop: '50px' }}>
                    <FeatureCard>
                        <FeatureIcon><FaLeaf /></FeatureIcon>
                        <FeatureTitle>Gestão de Talhões</FeatureTitle>
                        <FeatureDescription>
                            Organize sua fazenda em talhões para um gerenciamento mais eficiente,
                            acompanhando dados específicos de cada área e identificando oportunidades
                            de melhoria.
                        </FeatureDescription>
                    </FeatureCard>
                    
                    <FeatureCard>
                        <FeatureIcon><FaSeedling /></FeatureIcon>
                        <FeatureTitle>Manejo de Cultivares</FeatureTitle>
                        <FeatureDescription>
                            Compare o desempenho de diferentes cultivares na sua fazenda,
                            identificando quais apresentam melhor produtividade, resistência
                            e qualidade de grãos.
                        </FeatureDescription>
                    </FeatureCard>
                    
                    <FeatureCard>
                        <FeatureIcon><FaUserAlt /></FeatureIcon>
                        <FeatureTitle>Dashboard Personalizado</FeatureTitle>
                        <FeatureDescription>
                            Acesse um painel personalizado com todas as informações relevantes
                            sobre sua lavoura em um só lugar, facilitando a tomada de decisões
                            estratégicas.
                        </FeatureDescription>
                    </FeatureCard>
                </FeatureGrid>
            </FeaturesSection>
            
            <CTASection>
                <CTATitle>Pronto para transformar sua produção?</CTATitle>
                <CTADescription>
                    Junte-se a centenas de produtores que já estão usando o Futuro Café para 
                    maximizar seus resultados e tomar decisões baseadas em dados.
                </CTADescription>
                <Button onClick={handleGetStarted}>
                    {isAuthenticated ? 'Acessar Dashboard' : 'Criar Conta Grátis'} <FaArrowRight />
                </Button>
            </CTASection>
            
            <TestimonialSection>
                <TestimonialTitle>O que dizem nossos clientes</TestimonialTitle>
                <TestimonialGrid>
                    <TestimonialCard>
                        <TestimonialText>
                            "O Futuro Café transformou completamente a forma como gerencio minha 
                            fazenda. A previsão de safra tem uma precisão incrível, o que me 
                            ajudou muito no planejamento financeiro."
                        </TestimonialText>
                        <TestimonialAuthor>Carlos Mendes, Produtor em Minas Gerais</TestimonialAuthor>
                    </TestimonialCard>
                    
                    <TestimonialCard>
                        <TestimonialText>
                            "Consegui aumentar a produtividade da minha fazenda em 30% após 
                            implementar as recomendações do sistema. A análise detalhada de 
                            cada talhão fez toda a diferença."
                        </TestimonialText>
                        <TestimonialAuthor>Ana Carolina, Produtora em São Paulo</TestimonialAuthor>
                    </TestimonialCard>
                    
                    <TestimonialCard>
                        <TestimonialText>
                            "A ferramenta de planejamento de colheita me ajudou a melhorar a 
                            qualidade do meu café, conseguindo preços melhores no mercado. 
                            Investimento que se pagou rapidamente."
                        </TestimonialText>
                        <TestimonialAuthor>Ricardo Alves, Produtor no Espírito Santo</TestimonialAuthor>
                    </TestimonialCard>
                </TestimonialGrid>
            </TestimonialSection>
            
            <Footer>
                <FooterText>Futuro Café ©2024 - Todos os direitos reservados</FooterText>
                <div>
                    <FooterLink to="/politica-de-privacidade">Política de Privacidade</FooterLink>
                    <FooterLink to="/termos-de-uso">Termos de Uso</FooterLink>
                    <FooterLink to="/contato">Contato</FooterLink>
                </div>
            </Footer>
        </HomeContainer>
    );
};

export default HomePage;
