# Variáveis de ambiente para Docker

Para executar o projeto com Docker, você precisará configurar as seguintes variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto com estas variáveis:

```env
# Configuração do Banco de Dados
DB_HOST=database
DB_PORT=1433
DB_NAME=futurocafe
DB_USER=sa
DB_PASS=SuaSenhaForte123!

# Autenticação e Segurança
JWT_SECRET=seu_jwt_secret_seguro

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=sua_connection_string

# Serviço de IA
PREDICTION_REQUEST_URL=url_servico_ia

# URLs
FRONTEND_URL=http://localhost
VITE_API_URL=http://localhost:3000/api
```

## Instruções para execução

1. Copie as variáveis acima para um arquivo `.env` na raiz do projeto
2. Ajuste os valores conforme seu ambiente
3. Execute o comando: `docker-compose up -d`

## Notas importantes

- O banco de dados SQL Server será executado em um contêiner, mas você pode alterar a configuração para apontar para um servidor externo
- Certifique-se de que as portas 80 (frontend), 3000 (backend) e 1433 (SQL Server) estão disponíveis
- Os dados do SQL Server serão persistidos em um volume Docker
- Os uploads serão armazenados na pasta ./fc-web-be/uploads 