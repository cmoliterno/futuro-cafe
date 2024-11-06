import express from 'express';
import cors from 'cors';
import routes from './config/routes'; // Ajuste o caminho se necessário

const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:3001', // URL do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Outros middlewares
app.use(express.json());

// Use as rotas com o prefixo /api
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
