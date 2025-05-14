#!/bin/bash

# Script para migrar o Futuro Café do PM2 para Docker
echo "Iniciando a migração do Futuro Café do PM2 para Docker..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "Docker não encontrado. Por favor, instale o Docker antes de continuar."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose não encontrado. Por favor, instale o Docker Compose antes de continuar."
    exit 1
fi

# Verificar se o .env existe
if [ ! -f .env ]; then
    echo "Arquivo .env não encontrado. Criando um modelo a partir do DOCKER-ENV.md..."
    # Extrair o conteúdo entre as marcações ```env e ``` do arquivo DOCKER-ENV.md
    awk '/```env/{flag=1;next}/```/{flag=0}flag' DOCKER-ENV.md > .env
    echo "Arquivo .env criado. Por favor, edite-o com suas configurações antes de continuar."
    exit 1
fi

# Parar aplicações do PM2
echo "Parando aplicações do PM2..."
pm2 stop all

# Construir e iniciar os contêineres Docker
echo "Construindo e iniciando os contêineres Docker..."
docker-compose build
docker-compose up -d

# Verificar se os contêineres estão em execução
echo "Verificando se os contêineres estão em execução..."
docker-compose ps

echo "Migração concluída! O Futuro Café agora está executando com Docker."
echo "URLs de acesso:"
echo "- Frontend: http://localhost"
echo "- Backend API: http://localhost:3000/api"

# Adicionar instruções para limpeza do PM2 se desejado
echo ""
echo "Para remover completamente as aplicações do PM2, execute os seguintes comandos:"
echo "pm2 delete all"
echo "pm2 save" 