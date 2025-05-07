import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Container com ajustes para melhor visualização em dispositivos móveis
const Container = styled.div`
    padding: 20px;
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Roboto', Arial, sans-serif;
    color: #2C1810;
    background-color: #EEDCC8;
    min-height: 100vh;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch; /* Para melhor scroll em dispositivos iOS */
    
    @media (min-width: 768px) {
        padding: 40px;
        max-width: 1200px;
    }
`;

const Title = styled.h1`
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #2C1810;
    
    @media (min-width: 768px) {
        font-size: 2.5rem;
    }
`;

const Subtitle = styled.p`
    font-size: 0.9rem;
    margin-bottom: 20px;
    color: #5D4037;
    
    @media (min-width: 768px) {
        font-size: 1rem;
        margin-bottom: 30px;
    }
`;

const SectionTitle = styled.h2`
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 24px;
    margin-bottom: 12px;
    color: #2C1810;
    border-bottom: 2px solid #A67C52;
    padding-bottom: 8px;
    
    @media (min-width: 768px) {
        font-size: 1.8rem;
        margin-top: 30px;
        margin-bottom: 15px;
    }
`;

const SubSectionTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 16px;
    margin-bottom: 8px;
    color: #2C1810;
    
    @media (min-width: 768px) {
        font-size: 1.4rem;
        margin-top: 20px;
        margin-bottom: 10px;
    }
`;

const Text = styled.p`
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 12px;
    color: #5D4037;
    
    @media (min-width: 768px) {
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 15px;
    }
`;

const List = styled.ul`
    padding-left: 16px;
    margin-bottom: 16px;
    
    @media (min-width: 768px) {
        padding-left: 20px;
        margin-bottom: 20px;
    }
`;

const ListItem = styled.li`
    margin-bottom: 8px;
    font-size: 0.95rem;
    color: #5D4037;
    
    @media (min-width: 768px) {
        margin-bottom: 10px;
        font-size: 1rem;
    }
`;

const StyledLink = styled.a`
    color: #047502;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(4, 117, 2, 0.2); /* Feedback visual para toque em iOS */
    
    &:hover {
        text-decoration: underline;
    }
    
    &:active {
        color: #035802;
    }
`;

const NavigationButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    width: 100%;
    padding: 14px 24px;
    background-color: #047502;
    color: #EEDCC8;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 600;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    -webkit-tap-highlight-color: transparent; /* Remove feedback visual padrão no iOS */
    touch-action: manipulation; /* Melhora a resposta ao toque */
    
    &:hover {
        background-color: #035802;
    }
    
    &:active {
        background-color: #024401;
    }
    
    @media (min-width: 768px) {
        width: auto;
        margin-top: 30px;
    }
`;

const DeveloperInfo = styled.div`
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #A67C52;
    font-size: 0.9rem;
    color: #5D4037;
    text-align: center;
    
    @media (min-width: 768px) {
        margin-top: 60px;
        font-size: 1rem;
    }
`;

const SiteLink = styled.a`
    color: #047502;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(4, 117, 2, 0.2);
    
    &:hover {
        text-decoration: underline;
    }
    
    &:active {
        color: #035802;
    }
`;

const PrivacyPolicyScreen = () => {
    // Ajusta o viewport para telas móveis
    useEffect(() => {
        // Adiciona meta viewport para garantir renderização correta em dispositivos móveis
        const viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
        document.head.appendChild(viewportMeta);
        
        // Remove a meta tag ao desmontar o componente
        return () => {
            document.head.removeChild(viewportMeta);
        };
    }, []);

    return (
        <Container>
            <Title>Política de Privacidade do App Futuro Café</Title>
            <Subtitle>Data de Vigência: 08 de janeiro de 2025</Subtitle>

            <SectionTitle>Bem-vindo(a) ao Futuro Café</SectionTitle>
            <Text>
                Esta Política de Privacidade descreve como coletamos, usamos, processamos, armazenamos e compartilhamos 
                suas informações ao usar nosso aplicativo ("App"). Ela foi elaborada para cumprir os requisitos de privacidade, 
                incluindo aqueles estabelecidos pela Google Play Store e App Store. Ao utilizar nosso App, você concorda 
                com as práticas descritas nesta Política de Privacidade.
            </Text>

            <SectionTitle>1. Identidade do Desenvolvedor</SectionTitle>
            <Text>
                O Futuro Café é desenvolvido e mantido pela Qwize ("nós" ou "nosso"). Caso tenha dúvidas sobre esta 
                Política de Privacidade ou sobre como tratamos seus dados, entre em contato conosco conforme descrito 
                na Seção 8 ("Contato").
            </Text>

            <SectionTitle>2. Como Acessamos, Coletamos e Usamos Seus Dados</SectionTitle>
            <SubSectionTitle>2.1. Informações Pessoais</SubSectionTitle>
            <Text>Nome, E-mail, Número de telefone, Empresa/Organização, Cargo.</Text>
            <Text>Finalidades do Tratamento:</Text>
            <List>
                <ListItem>Atender às suas solicitações e fornecer suporte relacionado ao App.</ListItem>
                <ListItem>Compreender suas necessidades e oferecer uma melhor experiência de uso.</ListItem>
                <ListItem>Enviar atualizações sobre nossos produtos, serviços ou promoções (somente com sua permissão prévia).</ListItem>
            </List>
            
            <SubSectionTitle>2.2. Dados de Localização</SubSectionTitle>
            <Text>
                Finalidade: identificar a localização do talhão para análises de plantio, clima, produtividade 
                e demais funcionalidades relacionadas à sua fazenda.
            </Text>

            <SubSectionTitle>2.3. Compatibilidade com iOS e Android</SubSectionTitle>
            <Text>
                Nosso aplicativo é compatível com dispositivos iOS e Android, seguindo as diretrizes de 
                privacidade de ambas as plataformas. Garantimos que todas as permissões solicitadas são 
                claramente informadas e necessárias para o funcionamento adequado do aplicativo.
            </Text>

            <SectionTitle>3. Compartilhamento de Informações</SectionTitle>
            <Text>
                Não vendemos, alugamos ou compartilhamos informações pessoais para fins de marketing com terceiros 
                sem sua permissão explícita.
            </Text>

            <SectionTitle>4. Proteção e Segurança dos Dados</SectionTitle>
            <Text>
                Implementamos medidas de segurança físicas, eletrônicas e administrativas para proteger suas 
                informações contra acesso não autorizado.
            </Text>

            <SectionTitle>5. Retenção e Exclusão de Dados</SectionTitle>
            <Text>
                Retemos suas informações apenas pelo tempo necessário para cumprir as finalidades descritas nesta Política.
                Você pode solicitar a exclusão de seus dados a qualquer momento através dos canais de contato disponibilizados.
            </Text>

            <SectionTitle>6. Mudanças nesta Política de Privacidade</SectionTitle>
            <Text>
                Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas 
                práticas ou por motivos legais. Você será notificado sobre quaisquer alterações significativas.
            </Text>

            <SectionTitle>7. Disponibilidade e Acesso</SectionTitle>
            <Text>
                URL Ativo: nossa Política de Privacidade está disponível em{' '}
                <StyledLink href="https://portal.futurocafe.com.br/politica-de-privacidade" target="_blank" rel="noopener noreferrer">
                    https://portal.futurocafe.com.br/politica-de-privacidade
                </StyledLink>{' '}
                para consulta pública, sem restrições geográficas e em formato legível por qualquer navegador 
                sem necessidade de plug-ins ou leitores especiais.
            </Text>
            <Text>
                No App e na Página de Detalhes do App: esta Política de Privacidade também está vinculada na página 
                de "Detalhes do App" no Google Play Console e na App Store, bem como dentro do próprio App, 
                para fácil acesso a todos os usuários.
            </Text>

            <SectionTitle>8. Contato</SectionTitle>
            <Text>E-mail: suporte@qwize.io</Text>

            <NavigationButton to="/">Voltar para a página inicial</NavigationButton>
            
            <DeveloperInfo>
                Desenvolvido por Qwize | <SiteLink href="https://qwize.io" target="_blank" rel="noopener noreferrer">qwize.io</SiteLink>
            </DeveloperInfo>
        </Container>
    );
};

export default PrivacyPolicyScreen;
