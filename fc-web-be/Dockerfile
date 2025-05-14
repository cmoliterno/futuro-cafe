FROM node:16

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN rm -rf node_modules
RUN npm cache clean --force
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Copiar código-fonte e .env
COPY . .
COPY .env .env

# Limpar node_modules e reinstalar para garantir compatibilidade
RUN rm -rf node_modules
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Compilar o TypeScript
RUN npm run build

# Configurar variáveis de ambiente
ENV NODE_ENV=production

# Expor a porta que o servidor usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"] 