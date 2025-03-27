# Fluxo Detalhado da Aplicação Futuro Café

## 1. Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant D as Database

    U->>F: Acessa aplicação
    F->>F: Verifica token
    alt Tem token válido
        F->>B: Valida token
        B->>F: Token OK
        F->>U: Acesso liberado
    else Sem token/Token inválido
        F->>U: Redireciona login
        U->>F: Insere credenciais
        F->>B: Login request
        B->>D: Valida usuário
        D->>B: Retorna dados
        B->>F: JWT Token
        F->>U: Acesso liberado
    end
```

## 2. Fluxo de Análise Rápida

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant AI as Serviço IA
    participant S as Storage
    participant D as Database

    U->>F: Upload imagens (L/R)
    F->>F: Valida imagens
    F->>B: Envia imagens + descrição
    B->>B: Cria grupo
    B->>D: Salva grupo
    B->>S: Upload imagens
    B->>AI: Processa imagens
    AI->>B: Retorna análise
    B->>S: Salva imagens processadas
    B->>D: Salva resultados
    B->>F: Status completo
    F->>U: Mostra resultados
```

## 3. Fluxo de Análise por Talhão

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant AI as Serviço IA
    participant S as Storage
    participant D as Database

    U->>F: Seleciona fazenda
    F->>B: Busca talhões
    B->>D: Query talhões
    D->>B: Lista talhões
    B->>F: Retorna talhões
    U->>F: Seleciona talhão
    U->>F: Upload imagem
    F->>B: Envia imagem + talhãoId
    B->>S: Upload imagem
    B->>AI: Processa imagem
    AI->>B: Retorna análise
    B->>S: Salva imagem processada
    B->>D: Salva resultados
    B->>F: Status completo
    F->>U: Mostra resultados
```

## 4. Fluxo de Visualização de Dados

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant D as Database

    U->>F: Acessa dashboard
    F->>B: Requisita dados
    B->>D: Queries análises
    D->>B: Retorna dados
    B->>B: Processa estatísticas
    B->>F: Envia dados
    F->>F: Gera gráficos
    F->>U: Exibe dashboard
```

## 5. Fluxo de Gestão de Fazendas

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant D as Database

    U->>F: Acessa fazendas
    F->>B: Lista fazendas
    B->>D: Query fazendas
    D->>B: Retorna fazendas
    B->>F: Lista fazendas
    
    alt Criar Nova Fazenda
        U->>F: Preenche dados
        U->>F: Desenha área
        F->>B: Envia dados
        B->>D: Salva fazenda
        D->>B: Confirma
        B->>F: Atualiza lista
    else Gerenciar Talhões
        U->>F: Seleciona fazenda
        F->>B: Lista talhões
        B->>D: Query talhões
        D->>B: Retorna talhões
        B->>F: Exibe talhões
    end
```

## 6. Fluxo de Processamento de Imagens

```mermaid
sequenceDiagram
    participant B as Backend
    participant AI as Serviço IA
    participant S as Storage

    B->>B: Recebe imagem
    B->>S: Upload original
    B->>AI: Envia para análise
    AI->>AI: Pré-processamento
    AI->>AI: Detecção objetos
    AI->>AI: Classificação
    AI->>AI: Contagem
    AI->>AI: Gera visualização
    AI->>B: Retorna resultados
    B->>S: Salva imagem processada
    B->>B: Atualiza status
```

## 7. Fluxo de Integração de Dados

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant D as Database
    participant C as Cache

    F->>B: Requisita dados
    B->>C: Verifica cache
    alt Cache hit
        C->>B: Retorna dados
        B->>F: Dados do cache
    else Cache miss
        B->>D: Query dados
        D->>B: Retorna dados
        B->>C: Atualiza cache
        B->>F: Novos dados
    end
```

## 8. Fluxo de Exportação de Relatórios

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant D as Database

    U->>F: Solicita relatório
    F->>B: Requisita dados
    B->>D: Queries múltiplas
    D->>B: Retorna dados
    B->>B: Processa dados
    B->>B: Gera PDF/Excel
    B->>F: Envia arquivo
    F->>U: Download relatório
``` 