import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaCamera } from 'react-icons/fa';
import api from '../services/api';

const TalhoesContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
`;

const Title = styled.h1`
  color: #333;
`;

const Input = styled.input`
  margin-right: 10px;
  padding: 8px;
`;

const Select = styled.select`
  margin-right: 10px;
  padding: 8px;
`;

const Button = styled.button`
  padding: 8px 12px;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const TableRow = styled.tr`
  border: 1px solid #ddd;
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  border: none;
  cursor: pointer;
`;

interface Talhao {
    id: string;
    nome: string;
    fazendaId: string;
    dataPlantio: string;
    espacamentoLinhas: number;
    espacamentoMudas: number;
    cultivarId: number;
}

const TalhoesPage: React.FC = () => {
    const [talhoes, setTalhoes] = useState<Talhao[]>([]);
    const [nome, setNome] = useState('');
    const [fazendaId, setFazendaId] = useState<string>('');
    const [fazendas, setFazendas] = useState([]);
    const [cultivares, setCultivares] = useState([]);
    const [dataPlantio, setDataPlantio] = useState('');
    const [espacamentoLinhas, setEspacamentoLinhas] = useState<number>(0);
    const [espacamentoMudas, setEspacamentoMudas] = useState<number>(0);
    const [cultivarId, setCultivarId] = useState<number>(0);
    const [editId, setEditId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTalhoes();
        fetchFazendas();
        fetchCultivares();
    }, []);

    const navigateToPhotoCollection = (talhaoId: string) => {
        window.location.href = `/coleta-imagens/${talhaoId}`;
    };

    const fetchTalhoes = async () => {
        const response = await api.getAllTalhoes();
        setTalhoes(response.data);
    };

    const fetchFazendas = async () => {
        const response = await api.getAllFazendas();
        setFazendas(response.data);
    };

    const fetchCultivares = async () => {
        const response = await api.getAllCultivares();
        setCultivares(response.data);
    };

    const handleCreate = async () => {
        await api.createTalhao({
            nome,
            fazendaId,
            dataPlantio,
            espacamentoLinhas,
            espacamentoMudas,
            cultivarId,
        });
        resetFields();
        fetchTalhoes();
    };

    const handleEdit = async () => {
        if (editId) {
            await api.updateTalhao(editId, {
                nome,
                fazendaId,
                dataPlantio,
                espacamentoLinhas,
                espacamentoMudas,
                cultivarId,
            });
            resetFields();
            fetchTalhoes();
        }
    };

    const handleDelete = async (id: string) => {
        await api.deleteTalhao(id);
        fetchTalhoes();
    };

    const resetFields = () => {
        setEditId(null);
        setNome('');
        setFazendaId('');
        setDataPlantio('');
        setEspacamentoLinhas(0);
        setEspacamentoMudas(0);
        setCultivarId(0);
    };

    const filteredTalhoes = talhoes.filter(talhao =>
        talhao.nome.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedTalhoes = filteredTalhoes.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <TalhoesContainer>
            <Title>Talhões</Title>
            <Select
                value={fazendaId}
                onChange={(e) => setFazendaId(e.target.value)}
            >
                <option value="" disabled>Selecione a Fazenda</option>
                {fazendas.map((fazenda: any) => (
                    <option key={fazenda.id} value={fazenda.id}>
                        {fazenda.nome}
                    </option>
                ))}
            </Select>

            <Input
                type="text"
                value={nome}
                placeholder="Nome do Talhão"
                onChange={(e) => setNome(e.target.value)}
                disabled={!fazendaId}
            />
            <Input
                type="date"
                value={dataPlantio}
                onChange={(e) => setDataPlantio(e.target.value)}
                disabled={!fazendaId}
            />
            <Input
                type="text"
                value={espacamentoLinhas.toFixed(2)}
                placeholder="Espaçamento entre Linhas (m)"
                onChange={(e) => setEspacamentoLinhas(parseFloat(e.target.value))}
                disabled={!fazendaId}
            />
            <Input
                type="text"
                value={espacamentoMudas.toFixed(2)}
                placeholder="Espaçamento entre Mudas (m)"
                onChange={(e) => setEspacamentoMudas(parseFloat(e.target.value))}
                disabled={!fazendaId}
            />
            <Select
                value={cultivarId}
                onChange={(e) => setCultivarId(parseInt(e.target.value))}
                disabled={!fazendaId}
            >
                <option value="" disabled>Selecione o Cultivar</option>
                {cultivares.map((cultivar: any) => (
                    <option key={cultivar.id} value={cultivar.id}>
                        {cultivar.nome}
                    </option>
                ))}
            </Select>
            <Button onClick={editId ? handleEdit : handleCreate} disabled={!fazendaId}>
                {editId ? 'Salvar Alterações' : 'Adicionar Talhão'}
            </Button>

            <div style={{ marginBottom: '20px' }}>
                <Input
                    type="text"
                    value={search}
                    placeholder="Buscar Talhão"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <Table>
                <thead>
                <tr>
                    <TableHeader>Nome</TableHeader>
                    <TableHeader>ID da Fazenda</TableHeader>
                    <TableHeader>Ações</TableHeader>
                </tr>
                </thead>
                <tbody>
                {paginatedTalhoes.map((talhao: Talhao) => (
                    <TableRow key={talhao.id}>
                        <TableData>{talhao.nome}</TableData>
                        <TableData>{talhao.fazendaId}</TableData>
                        <TableData>
                            <ActionButton onClick={() => {
                                // Adiciona um log para depuração
                                console.log('Editando talhão:', talhao);
                                setEditId(talhao.id);
                                setNome(talhao.nome);
                                setFazendaId(talhao.fazendaId);
                                setDataPlantio(talhao.dataPlantio);
                                setEspacamentoLinhas(talhao.espacamentoLinhas);
                                setEspacamentoMudas(talhao.espacamentoMudas);
                                setCultivarId(talhao.cultivarId);
                            }}>
                                <FaEdit size={20} title="Editar" />
                            </ActionButton>
                            <ActionButton onClick={() => handleDelete(talhao.id)}>
                                <FaTrash size={20} title="Excluir" />
                            </ActionButton>
                            <ActionButton onClick={() => navigateToPhotoCollection(talhao.id)}>
                                <FaCamera size={20} title="Coletar Imagem" />
                            </ActionButton>
                        </TableData>
                    </TableRow>
                ))}
                </tbody>
            </Table>
            <PaginationContainer>
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</Button>
                <span>Página {page}</span>
                <Button onClick={() => setPage(page + 1)} disabled={page * itemsPerPage >= filteredTalhoes.length}>Próximo</Button>
            </PaginationContainer>
        </TalhoesContainer>
    );
};

export default TalhoesPage;
