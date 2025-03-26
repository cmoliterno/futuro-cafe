// Arquivo de teste para chamar diretamente o endpoint compare-analises
// Execute este arquivo no console do navegador para testar

async function testCompareEndpoint() {
    // Teste 1: Filtros diferentes para cada lado
    const testData1 = {
        filtersLeft: {
            fazenda: 'f1',  // IDs fictícios
            talhao: 't1',
            startDate: '2024-01-01',
            endDate: '2024-01-31'
        },
        filtersRight: {
            fazenda: 'f2',  // Diferente do left
            talhao: 't2',   // Diferente do left
            startDate: '2024-02-01',
            endDate: '2024-02-29'
        }
    };

    console.log('Enviando teste 1:', JSON.stringify(testData1, null, 2));
    try {
        const response = await fetch('/api/compare-analises', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Adicione o token de autenticação se necessário
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(testData1)
        });

        const data = await response.json();
        console.log('Resposta do teste 1:', JSON.stringify(data, null, 2));
        console.log('Os dados são iguais?', JSON.stringify(data.leftData) === JSON.stringify(data.rightData));
    } catch (error) {
        console.error('Erro no teste 1:', error);
    }
}

// Não execute automaticamente
console.log('Para testar manualmente, execute testCompareEndpoint() no console'); 