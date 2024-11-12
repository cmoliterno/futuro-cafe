import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve os arquivos da pasta build (frontend)
app.use(express.static(path.join(__dirname, 'fc-web-fe/build')));

// Redireciona todas as rotas para o index.html do React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'fc-web-fe/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
