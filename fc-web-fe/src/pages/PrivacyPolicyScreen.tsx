import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyScreen = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Política de Privacidade do App Futuro Café</h1>
            <p style={styles.subtitle}>Data de Vigência: 08 de janeiro de 2025</p>

            <section>
                <h2 style={styles.sectionTitle}>Bem-vindo(a) ao Futuro Café.</h2>
                <p style={styles.text}>Esta Política de Privacidade descreve como coletamos, usamos, processamos, armazenamos e compartilhamos suas informações ao usar nosso aplicativo (“App”). Ela foi elaborada para cumprir os requisitos de privacidade, incluindo aqueles estabelecidos pela Google Play Store. Ao utilizar nosso App, você concorda com as práticas descritas nesta Política de Privacidade.</p>
            </section>

            <section>
                <h2 style={styles.sectionTitle}>1. Identidade do Desenvolvedor</h2>
                <p style={styles.text}>O Futuro Café é desenvolvido e mantido pela Qwize (“nós” ou “nosso”). Caso tenha dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, entre em contato conosco conforme descrito na Seção 8 (“Contato”).</p>
            </section>

            <section>
                <h2 style={styles.sectionTitle}>2. Como Acessamos, Coletamos e Usamos Seus Dados</h2>
                <h3 style={styles.subSectionTitle}>2.1. Informações Pessoais</h3>
                <p style={styles.text}>Nome, E-mail, Número de telefone, Empresa/Organização, Cargo.</p>
                <p style={styles.text}>Finalidades do Tratamento:</p>
                <ul>
                    <li style={styles.listItem}>Atender às suas solicitações e fornecer suporte relacionado ao App.</li>
                    <li style={styles.listItem}>Compreender suas necessidades e oferecer uma melhor experiência de uso.</li>
                    <li style={styles.listItem}>Enviar atualizações sobre nossos produtos, serviços ou promoções (somente com sua permissão prévia).</li>
                </ul>
                <h3 style={styles.subSectionTitle}>2.2. Dados de Localização</h3>
                <p style={styles.text}>Finalidade: identificar a localização do talhão para análises de plantio, clima, produtividade e demais funcionalidades relacionadas à sua fazenda.</p>
            </section>

            <section>
                <h2 style={styles.sectionTitle}>3. Compartilhamento de Informações</h2>
                <p style={styles.text}>Não vendemos, alugamos ou compartilhamos informações pessoais para fins de marketing com terceiros sem sua permissão explícita.</p>
            </section>

            <section>
                <h2 style={styles.sectionTitle}>4. Proteção e Segurança dos Dados</h2>
                <p style={styles.text}>Implementamos medidas de segurança físicas, eletrônicas e administrativas para proteger suas informações contra acesso não autorizado.</p>
            </section>

            <section>
                <h2 style={styles.sectionTitle}>5. Retenção e Exclusão de Dados</h2>
                <p style={styles.text}>Retemos suas informações apenas pelo tempo necessário para cumprir as finalidades descritas nesta Política.</p>
            </section>

            <section>
                <h2 style={styles.sectionTitle}>6. Mudanças nesta Política de Privacidade</h2>
                <p style={styles.text}>Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou por motivos legais.</p>
            </section>

            <section>
                <h2 style={styles.sectionTitle}>7. Disponibilidade e Acesso</h2>
                <p style={styles.text}>URL Ativo: nossa Política de Privacidade está disponível em <a href="https://portal.futurocafe.com.br/politica-de-privacidade" target="_blank" style={styles.link}>https://portal.futurocafe.com.br/politica-de-privacidade</a> para consulta pública, sem restrições geográficas e em formato legível por qualquer navegador sem necessidade de plug-ins ou leitores especiais.</p>
                <p style={styles.text}>No App e na Página de Detalhes do App: esta Política de Privacidade também está vinculada na página de “Detalhes do App” no Google Play Console, bem como dentro do próprio App, para fácil acesso a todos os usuários.</p>
            </section>

            <section>
                <h2 style={styles.sectionTitle}>8. Contato</h2>
                <p style={styles.text}>E-mail: suporte@qwize.io</p>
            </section>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '16px',
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginTop: '20px',
    },
    subSectionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: '15px',
    },
    text: {
        fontSize: '16px',
        lineHeight: '1.5',
        marginBottom: '10px',
    },
    listItem: {
        marginLeft: '20px',
        fontSize: '16px',
        marginBottom: '5px',
    },
    link: {
        color: '#1a73e8',
        textDecoration: 'none',
    },
};

export default PrivacyPolicyScreen;
