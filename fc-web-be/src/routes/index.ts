// Rotas para análise rápida
app.post('/api/analises-rapidas/criar-grupo', upload.fields([
    { name: 'imagensEsquerdo', maxCount: 20 },
    { name: 'imagensDireito', maxCount: 20 }
]), analiseRapidaController.createAnaliseRapidaGroup);
app.get('/api/analises-rapidas/:id', analiseRapidaController.getAnaliseRapidaById);
app.get('/api/analises-rapidas/:id/status', analiseRapidaController.checkAnaliseRapidaStatus);
app.get('/api/analises-rapidas/:id/comparacao', analiseRapidaController.compareAnaliseRapida);
app.get('/api/analises-rapidas/historico', analiseRapidaController.getAnaliseRapidaHistorico);
app.delete('/api/analises-rapidas/:id', analiseRapidaController.deleteAnaliseRapida); 