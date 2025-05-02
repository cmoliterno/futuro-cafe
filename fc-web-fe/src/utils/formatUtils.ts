// Função para formatar números como porcentagem
export const percentFormatter = (value: number) => {
    if (typeof value !== 'number') return '0%';
    return `${value.toFixed(1)}%`;
};

// Função para formatar data no padrão brasileiro
export const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
}; 