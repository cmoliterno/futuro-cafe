// Função para obter o primeiro dia do mês atual formatado como YYYY-MM-DD
export const getFirstDayOfCurrentMonth = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
};
 
// Função para obter a data atual formatada como YYYY-MM-DD
export const getCurrentDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}; 