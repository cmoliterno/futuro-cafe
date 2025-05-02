import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
 
// Função para formatar data no padrão brasileiro por extenso
export const formatarDataPorExtenso = (data: Date) => {
    return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}; 