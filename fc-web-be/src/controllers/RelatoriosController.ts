import { Request, Response } from 'express';
import { sequelize } from '../services/DatabaseService';
import { Op } from 'sequelize';
import Role from '../models/Role';
import Login from '../models/Login';
import * as XLSX from 'xlsx';

// Middleware para verificar se o usuário tem acesso a relatórios
export const verificarPermissaoRelatorios = async (req: Request, res: Response, next: Function) => {
  try {
    const userId = req.headers.userId as string;
    
    if (!userId) {
      console.log('Usuário não autenticado - userId não encontrado no header');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    console.log(`Verificando permissão para usuário ID: ${userId}`);

    // Usando uma consulta SQL direta para evitar problemas com o Sequelize
    const [results] = await sequelize.query(`
      SELECT COUNT(1) as count
      FROM [futurocafe-prod].dbo.tbLogin l
      JOIN [futurocafe-prod].dbo.tbLoginRole lr ON l.Id = lr.LoginId
      JOIN [futurocafe-prod].dbo.tbRole r ON lr.RoleId = r.Id
      WHERE l.PessoaFisicaId = :userId AND r.SystemKey = 'Reports.Access'
    `, { 
      replacements: { userId }
    });

    // Verificar se algum resultado foi encontrado
    const count = results && Array.isArray(results) && results.length > 0 ? (results[0] as any).count : 0;
    
    if (count === 0) {
      console.log(`Usuário ${userId} não possui permissão para relatórios`);
      return res.status(403).json({ message: 'Usuário não possui permissão para acessar relatórios' });
    }

    console.log(`Permissão verificada com sucesso para usuário ${userId}`);
    next();
  } catch (error) {
    console.error('Erro ao verificar permissão de relatórios:', error);
    res.status(500).json({ message: 'Erro interno ao verificar permissões' });
  }
};

// Obter fazendas para o filtro
export const getFazendasParaRelatorio = async (req: Request, res: Response) => {
  try {
    const fazendas = await sequelize.query(`
      SELECT Id, Nome
      FROM [futurocafe-prod].dbo.tbFazenda
      ORDER BY Nome
    `, { type: 'SELECT' });
    
    res.json(fazendas);
  } catch (error) {
    console.error('Erro ao obter fazendas para relatório:', error);
    res.status(500).json({ message: 'Erro interno ao buscar fazendas' });
  }
};

// Obter talhões por fazenda para o filtro
export const getTalhoesPorFazendaParaRelatorio = async (req: Request, res: Response) => {
  try {
    const { fazendaIds } = req.query;
    let whereClause = '';
    
    if (fazendaIds) {
      const idsArray = Array.isArray(fazendaIds) ? fazendaIds : [fazendaIds];
      
      if (idsArray.length > 0) {
        const formattedIds = idsArray.map(id => `'${id}'`).join(',');
        whereClause = `WHERE FazendaId IN (${formattedIds})`;
      }
    }
    
    const talhoes = await sequelize.query(`
      SELECT Id, Nome, FazendaId
      FROM [futurocafe-prod].dbo.tbTalhao
      ${whereClause}
      ORDER BY Nome
    `, { type: 'SELECT' });
    
    res.json(talhoes);
  } catch (error) {
    console.error('Erro ao obter talhões para relatório:', error);
    res.status(500).json({ message: 'Erro interno ao buscar talhões' });
  }
};

// Gerar o relatório baseado nos filtros (formato XLSX)
export const gerarRelatorio = async (req: Request, res: Response) => {
  try {
    const { fazendaIds, talhaoIds, dataInicio, dataFim } = req.body;
    
    // Preparar as cláusulas WHERE
    let whereClausesTalhao = [];
    let whereClausesData = [];
    
    if (fazendaIds && fazendaIds.length > 0) {
      const formattedFazendaIds = fazendaIds.map((id: string) => `'${id}'`).join(',');
      whereClausesTalhao.push(`t.FazendaId IN (${formattedFazendaIds})`);
    }
    
    if (talhaoIds && talhaoIds.length > 0) {
      const formattedTalhaoIds = talhaoIds.map((id: string) => `'${id}'`).join(',');
      whereClausesTalhao.push(`t.Id IN (${formattedTalhaoIds})`);
    }

    if (dataInicio && dataFim) {
      whereClausesData.push(`YEAR(p.[Data]) BETWEEN ${dataInicio} AND ${dataFim}`);
    }
    
    // Construir a cláusula WHERE completa
    let whereClause = '';
    
    if (whereClausesTalhao.length > 0) {
      whereClause += whereClausesTalhao.join(' AND ');
    }
    
    if (whereClausesData.length > 0) {
      if (whereClause) {
        whereClause += ' AND ';
      }
      whereClause += whereClausesData.join(' AND ');
    }
    
    // Executa a query com os filtros
    const queryBase = `
      SELECT 
        t.Id AS TalhaoId,
        t.Nome AS NomeTalhao,
        YEAR(p.[Data]) AS AnoPlantio,
        p.EspacamentoLinhasMetros,
        p.EspacamentoMudasMetros,
        c.Nome AS Variedade,
        td.ImagemUrl AS FotoTalhao,
        a.ImagemUrl AS FotoAnalise,
        a.Cherry,
        a.Dry,
        a.Green,
        a.GreenYellow,
        a.Raisin,
        a.Total
      FROM [futurocafe-prod].dbo.tbTalhao t
      INNER JOIN [futurocafe-prod].dbo.tbPlantio p 
          ON t.Id = p.TalhaoId
      INNER JOIN [futurocafe-prod].dbo.tbCultivar c 
          ON p.CultivarId = c.Id
      LEFT JOIN [futurocafe-prod].dbo.tbTalhaoDesenho td 
          ON t.Id = td.TalhaoId
      LEFT JOIN [futurocafe-prod].dbo.tbAnalise a 
          ON t.Id = a.TalhaoId
    `;
    
    const queryFinal = whereClause 
      ? `${queryBase} WHERE ${whereClause} ORDER BY t.Nome`
      : `${queryBase} ORDER BY t.Nome`;
    
    const resultados = await sequelize.query(queryFinal, { type: 'SELECT' });
    
    // Preparar dados para o Excel
    const dados = resultados.map((item: any) => ({
      'ID do Talhão': item.TalhaoId,
      'Nome do Talhão': item.NomeTalhao,
      'Ano de Plantio': item.AnoPlantio,
      'Espaçamento Linhas (m)': item.EspacamentoLinhasMetros,
      'Espaçamento Mudas (m)': item.EspacamentoMudasMetros,
      'Variedade': item.Variedade,
      'Cherry': item.Cherry,
      'Dry': item.Dry,
      'Green': item.Green,
      'Green/Yellow': item.GreenYellow,
      'Raisin': item.Raisin,
      'Total': item.Total
    }));

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dados);

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Relatório de Talhões");

    // Gerar buffer do arquivo Excel
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Configurar headers para download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-talhoes.xlsx');
    
    // Enviar o arquivo Excel
    res.send(excelBuffer);
    
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro interno ao gerar relatório' });
  }
};

export default {
  verificarPermissaoRelatorios,
  getFazendasParaRelatorio,
  getTalhoesPorFazendaParaRelatorio,
  gerarRelatorio
}; 