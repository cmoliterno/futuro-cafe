import express from 'express';
import cors from 'cors';
import routes from './config/routes'; // Ajuste o caminho se necessário

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://painelfuturocafe.qwize.io', process.env.FRONTEND_URL];

// Configuração do CORS
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware
app.use(express.json());

// Use as rotas com o prefixo /api
app.use('/api', routes);

export default app;
