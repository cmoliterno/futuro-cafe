import express from 'express';
import cors from 'cors';
import routes from './config/routes'; // Ajuste o caminho se necessário

const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:3001', // URL do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware
app.use(express.json());

// Use as rotas com o prefixo /api
app.use('/api', routes);

export default app;
