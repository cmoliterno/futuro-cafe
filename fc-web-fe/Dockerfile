# Estágio de build
FROM node:16-alpine as build

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código-fonte e .env
COPY . .
COPY .env .env

# Compilar o app
RUN npm run build

# Estágio de produção
FROM nginx:stable-alpine

# Copiar build do estágio anterior
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"] 