import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* Cores Primárias - Tons de marrom para identidade do café */
    --color-primary: #230C02;
    --color-primary-light: #3b1f12;
    --color-primary-dark: #150701;
    
    /* Cores Secundárias - Verde para representar as plantações */
    --color-secondary: #047502;
    --color-secondary-light: #058902;
    --color-secondary-dark: #036002;
    
    /* Cores de Destaque - Tons mais quentes */
    --color-accent: #985E3B;
    --color-accent-light: #b17a57;
    --color-accent-dark: #7a4c2f;
    
    /* Tons de Bege/Marrom para fundos - Suavidade e elegância */
    --color-background: #EEDCC8;
    --color-surface: #F5EEE6;
    --color-card: #FFFFFF;
    
    /* Cores Neutras */
    --color-gray-50: #f9fafb;
    --color-gray-100: #f3f4f6;
    --color-gray-200: #e5e7eb;
    --color-gray-300: #d1d5db;
    --color-gray-400: #9ca3af;
    --color-gray-500: #6b7280;
    --color-gray-600: #4b5563;
    --color-gray-700: #374151;
    --color-gray-800: #1f2937;
    --color-gray-900: #111827;
    
    /* Cores Funcionais */
    --color-error: #e74c3c;
    --color-error-light: #f8d7da;
    --color-success: #27ae60;
    --color-success-light: #d4edda;
    --color-warning: #f39c12;
    --color-warning-light: #fff3cd;
    --color-info: #3498db;
    --color-info-light: #d1ecf1;
    
    /* Espaçamento */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 48px;
    
    /* Bordas e Sombras */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --border-radius-xl: 16px;
    --border-radius-round: 50%;
    
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
    --shadow-card: 0 4px 8px rgba(0, 0, 0, 0.1);
    --shadow-button: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    /* Tipografia */
    --font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-md: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 24px;
    --font-size-xxl: 32px;
    
    /* Transições */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-family);
    background-color: var(--color-background);
    color: var(--color-gray-800);
    line-height: 1.5;
    font-size: var(--font-size-md);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: var(--spacing-md);
    color: var(--color-primary);
  }

  h1 {
    font-size: var(--font-size-xxl);
    text-align: center;
    margin-bottom: var(--spacing-lg);
  }

  h2 {
    font-size: var(--font-size-xl);
  }

  h3 {
    font-size: var(--font-size-lg);
  }

  p {
    margin-bottom: var(--spacing-md);
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  a {
    text-decoration: none;
    color: var(--color-secondary);
    transition: var(--transition-normal);
    
    &:hover {
      color: var(--color-secondary-dark);
    }
  }

  /* Estilo para formulários padrão */
  input, select, textarea {
    padding: 12px;
    border: 1px solid var(--color-gray-300);
    border-radius: var(--border-radius-md);
    width: 100%;
    transition: var(--transition-normal);
    background-color: white;
    
    &:focus {
      outline: none;
      border-color: var(--color-secondary);
      box-shadow: 0 0 0 2px rgba(4, 117, 2, 0.2);
    }
    
    &::placeholder {
      color: var(--color-gray-400);
    }
    
    &:disabled {
      background-color: var(--color-gray-100);
      cursor: not-allowed;
    }
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: var(--border-radius-md);
    padding: 12px 20px;
    font-weight: 500;
    transition: var(--transition-normal);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: var(--color-secondary);
    color: white;
    box-shadow: var(--shadow-button);
    
    &:hover {
      background-color: var(--color-secondary-dark);
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
  }

  /* Variantes de botões padrão */
  button.primary {
    background-color: var(--color-primary);
    
    &:hover {
      background-color: var(--color-primary-light);
    }
  }

  button.accent {
    background-color: var(--color-accent);
    
    &:hover {
      background-color: var(--color-accent-light);
    }
  }

  button.error, button.delete {
    background-color: var(--color-error);
    
    &:hover {
      background-color: #c0392b;
    }
  }

  button.info {
    background-color: var(--color-info);
    
    &:hover {
      background-color: #2980b9;
    }
  }

  button.success {
    background-color: var(--color-success);
    
    &:hover {
      background-color: #219a52;
    }
  }

  button.warning {
    background-color: var(--color-warning);
    color: var(--color-gray-800);
    
    &:hover {
      background-color: #d68910;
    }
  }

  button.outlined {
    background-color: transparent;
    border: 1px solid var(--color-secondary);
    color: var(--color-secondary);
    
    &:hover {
      background-color: rgba(4, 117, 2, 0.1);
    }
    
    &.primary {
      border-color: var(--color-primary);
      color: var(--color-primary);
      
      &:hover {
        background-color: rgba(35, 12, 2, 0.1);
      }
    }
    
    &.accent {
      border-color: var(--color-accent);
      color: var(--color-accent);
      
      &:hover {
        background-color: rgba(152, 94, 59, 0.1);
      }
    }
  }

  /* Classes de utilidade */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .flex {
    display: flex;
  }

  .flex-column {
    flex-direction: column;
  }

  .flex-center {
    justify-content: center;
    align-items: center;
  }

  .flex-between {
    justify-content: space-between;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .text-primary {
    color: var(--color-primary);
  }

  .text-secondary {
    color: var(--color-secondary);
  }

  .text-accent {
    color: var(--color-accent);
  }

  .mt-sm { margin-top: var(--spacing-sm); }
  .mt-md { margin-top: var(--spacing-md); }
  .mt-lg { margin-top: var(--spacing-lg); }
  .mt-xl { margin-top: var(--spacing-xl); }

  .mb-sm { margin-bottom: var(--spacing-sm); }
  .mb-md { margin-bottom: var(--spacing-md); }
  .mb-lg { margin-bottom: var(--spacing-lg); }
  .mb-xl { margin-bottom: var(--spacing-xl); }

  /* Layout de página padrão */
  .page-container {
    padding: var(--spacing-lg);
    background-color: var(--color-surface);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    margin: var(--spacing-lg);
  }
  
  /* Componentes comuns */
  .card {
    background-color: var(--color-card);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-card);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }
  
  .filters-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    background-color: var(--color-surface);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
  }
  
  .filter-group {
    flex: 1;
    min-width: 200px;
  }
  
  .filter-label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    color: var(--color-gray-700);
  }
  
  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-xl);
  }
  
  .result-card {
    background-color: var(--color-card);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-card);
    padding: var(--spacing-lg);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
  
  .actions-container {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
    flex-wrap: wrap;
  }
  
  .action-button {
    padding: 8px 12px;
    font-size: var(--font-size-sm);
  }
  
  /* Mensagens de feedback */
  .success-message {
    background-color: var(--color-success-light);
    border: 1px solid var(--color-success);
    color: var(--color-success);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-lg);
  }
  
  .error-message {
    background-color: var(--color-error-light);
    border: 1px solid var(--color-error);
    color: var(--color-error);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-lg);
  }
  
  /* Tabelas */
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: var(--spacing-lg);
  }
  
  th {
    text-align: left;
    padding: var(--spacing-md);
    background-color: var(--color-gray-100);
    color: var(--color-gray-800);
    font-weight: 600;
    border-bottom: 2px solid var(--color-gray-300);
  }
  
  td {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-gray-200);
  }
  
  tr:nth-child(even) {
    background-color: var(--color-gray-50);
  }
  
  tr:hover {
    background-color: var(--color-gray-100);
  }
`;

export default GlobalStyle; 