import React, { useState } from "react";
import { FaTimes, FaTable, FaChartBar } from "react-icons/fa";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import {
  ModalOverlay, ModalContent, Button, TabContainer, Tab,
  Table, Th, Td
} from "./ComparacaoRapidaStyles";
import { percentFormatter } from '../utils/formatUtils';

// Cores para os diferentes tipos de grãos
const COLORS = {
  green: "#388E3C",
  greenYellow: "#AFB42B",
  cherry: "#D32F2F",
  raisin: "#6D4C41",
  dry: "#9E9E9E"
};

const NAMES = {
  green: "Verde",
  greenYellow: "Verde Cana",
  cherry: "Cereja",
  raisin: "Passa",
  dry: "Seco"
};

const CHART_COLORS = ["#388E3C", "#AFB42B", "#D32F2F", "#6D4C41", "#9E9E9E"];

const formatPercent = (value: number, total: number) => {
  if (!total) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
};

interface ResultadosAnaliseRapidaProps {
  isOpen: boolean;
  onClose: () => void;
  resultados: any;
}

const ResultadosAnaliseRapida: React.FC<ResultadosAnaliseRapidaProps> = ({ 
  isOpen, 
  onClose, 
  resultados 
}) => {
  const [activeTab, setActiveTab] = useState<"grafico" | "tabela">("grafico");
  
  // Se não há resultados, não mostra nada
  if (!resultados) return null;
  
  // Prepara os dados para o gráfico de barras
  const chartData = (() => {
    if (!resultados) return [];
    
    const leftStats = resultados.grupo.estatisticasEsquerdo;
    const rightStats = resultados.grupo.estatisticasDireito;
    
    // Totais
    const totalLeft = 
      leftStats.green + 
      leftStats.greenYellow + 
      leftStats.cherry + 
      leftStats.raisin + 
      leftStats.dry;
    
    const totalRight = 
      rightStats.green + 
      rightStats.greenYellow + 
      rightStats.cherry + 
      rightStats.raisin + 
      rightStats.dry;
    
    return [
      {
        nome: "Esquerdo",
        green: leftStats.green,
        greenYellow: leftStats.greenYellow,
        cherry: leftStats.cherry,
        raisin: leftStats.raisin,
        dry: leftStats.dry,
        total: totalLeft,
      },
      {
        nome: "Direito",
        green: rightStats.green,
        greenYellow: rightStats.greenYellow,
        cherry: rightStats.cherry,
        raisin: rightStats.raisin,
        dry: rightStats.dry,
        total: totalRight,
      }
    ];
  })();
  
  // Prepara os dados para os gráficos de pizza
  const pieDataLeft = (() => {
    if (!resultados) return [];
    
    const stats = resultados.grupo.estatisticasEsquerdo;
    const total = stats.green + stats.greenYellow + stats.cherry + stats.raisin + stats.dry;
    
    return [
      { name: NAMES.green, value: stats.green, percent: (stats.green / total) * 100 },
      { name: NAMES.greenYellow, value: stats.greenYellow, percent: (stats.greenYellow / total) * 100 },
      { name: NAMES.cherry, value: stats.cherry, percent: (stats.cherry / total) * 100 },
      { name: NAMES.raisin, value: stats.raisin, percent: (stats.raisin / total) * 100 },
      { name: NAMES.dry, value: stats.dry, percent: (stats.dry / total) * 100 }
    ];
  })();
  
  const pieDataRight = (() => {
    if (!resultados) return [];
    
    const stats = resultados.grupo.estatisticasDireito;
    const total = stats.green + stats.greenYellow + stats.cherry + stats.raisin + stats.dry;
    
    return [
      { name: NAMES.green, value: stats.green, percent: (stats.green / total) * 100 },
      { name: NAMES.greenYellow, value: stats.greenYellow, percent: (stats.greenYellow / total) * 100 },
      { name: NAMES.cherry, value: stats.cherry, percent: (stats.cherry / total) * 100 },
      { name: NAMES.raisin, value: stats.raisin, percent: (stats.raisin / total) * 100 },
      { name: NAMES.dry, value: stats.dry, percent: (stats.dry / total) * 100 }
    ];
  })();
  
  // Componente de tooltip personalizado para o gráfico de pizza
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '8px', 
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 500 }}>{`${payload[0].name}`}</p>
          <p style={{ margin: 0 }}>{`Quantidade: ${payload[0].value}`}</p>
          <p style={{ margin: 0 }}>{`Percentual: ${payload[0].payload.percent.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Renderização do gráfico de barras comparativo
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nome" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => {
            // Formata o valor e o nome exibidos no tooltip
            if (name === 'total') return [value, 'Total'];
            return [value, NAMES[name as keyof typeof NAMES] || name];
          }} 
        />
        <Legend />
        <Bar dataKey="green" name={NAMES.green} fill={COLORS.green} stackId="a">
          <LabelList dataKey="green" position="inside" fill="#fff" />
        </Bar>
        <Bar dataKey="greenYellow" name={NAMES.greenYellow} fill={COLORS.greenYellow} stackId="a">
          <LabelList dataKey="greenYellow" position="inside" fill="#fff" />
        </Bar>
        <Bar dataKey="cherry" name={NAMES.cherry} fill={COLORS.cherry} stackId="a">
          <LabelList dataKey="cherry" position="inside" fill="#fff" />
        </Bar>
        <Bar dataKey="raisin" name={NAMES.raisin} fill={COLORS.raisin} stackId="a">
          <LabelList dataKey="raisin" position="inside" fill="#fff" />
        </Bar>
        <Bar dataKey="dry" name={NAMES.dry} fill={COLORS.dry} stackId="a">
          <LabelList dataKey="dry" position="inside" fill="#fff" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
  
  // Renderização dos gráficos de pizza
  const renderPieCharts = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      <div style={{ flex: 1, minWidth: '300px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem' }}>Lado Esquerdo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieDataLeft}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
            >
              {pieDataLeft.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ flex: 1, minWidth: '300px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem' }}>Lado Direito</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieDataRight}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
            >
              {pieDataRight.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  
  // Renderização da tabela de comparação
  const renderTable = () => {
    if (!resultados) return null;
    
    const leftStats = resultados.grupo.estatisticasEsquerdo;
    const rightStats = resultados.grupo.estatisticasDireito;
    
    const totalLeft = 
      leftStats.green + 
      leftStats.greenYellow + 
      leftStats.cherry + 
      leftStats.raisin + 
      leftStats.dry;
    
    const totalRight = 
      rightStats.green + 
      rightStats.greenYellow + 
      rightStats.cherry + 
      rightStats.raisin + 
      rightStats.dry;
      
    return (
      <Table>
        <thead>
          <tr>
            <Th>Tipo</Th>
            <Th>Lado Esquerdo</Th>
            <Th>%</Th>
            <Th>Lado Direito</Th>
            <Th>%</Th>
            <Th>Diferença</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td style={{ fontWeight: 500, color: COLORS.green }}>{NAMES.green}</Td>
            <Td>{leftStats.green}</Td>
            <Td>{formatPercent(leftStats.green, totalLeft)}</Td>
            <Td>{rightStats.green}</Td>
            <Td>{formatPercent(rightStats.green, totalRight)}</Td>
            <Td>
              {((rightStats.green / totalRight) - (leftStats.green / totalLeft)) > 0 ? '+' : ''}
              {(((rightStats.green / totalRight) - (leftStats.green / totalLeft)) * 100).toFixed(1)}%
            </Td>
          </tr>
          <tr>
            <Td style={{ fontWeight: 500, color: COLORS.greenYellow }}>{NAMES.greenYellow}</Td>
            <Td>{leftStats.greenYellow}</Td>
            <Td>{formatPercent(leftStats.greenYellow, totalLeft)}</Td>
            <Td>{rightStats.greenYellow}</Td>
            <Td>{formatPercent(rightStats.greenYellow, totalRight)}</Td>
            <Td>
              {((rightStats.greenYellow / totalRight) - (leftStats.greenYellow / totalLeft)) > 0 ? '+' : ''}
              {(((rightStats.greenYellow / totalRight) - (leftStats.greenYellow / totalLeft)) * 100).toFixed(1)}%
            </Td>
          </tr>
          <tr>
            <Td style={{ fontWeight: 500, color: COLORS.cherry }}>{NAMES.cherry}</Td>
            <Td>{leftStats.cherry}</Td>
            <Td>{formatPercent(leftStats.cherry, totalLeft)}</Td>
            <Td>{rightStats.cherry}</Td>
            <Td>{formatPercent(rightStats.cherry, totalRight)}</Td>
            <Td>
              {((rightStats.cherry / totalRight) - (leftStats.cherry / totalLeft)) > 0 ? '+' : ''}
              {(((rightStats.cherry / totalRight) - (leftStats.cherry / totalLeft)) * 100).toFixed(1)}%
            </Td>
          </tr>
          <tr>
            <Td style={{ fontWeight: 500, color: COLORS.raisin }}>{NAMES.raisin}</Td>
            <Td>{leftStats.raisin}</Td>
            <Td>{formatPercent(leftStats.raisin, totalLeft)}</Td>
            <Td>{rightStats.raisin}</Td>
            <Td>{formatPercent(rightStats.raisin, totalRight)}</Td>
            <Td>
              {((rightStats.raisin / totalRight) - (leftStats.raisin / totalLeft)) > 0 ? '+' : ''}
              {(((rightStats.raisin / totalRight) - (leftStats.raisin / totalLeft)) * 100).toFixed(1)}%
            </Td>
          </tr>
          <tr>
            <Td style={{ fontWeight: 500, color: COLORS.dry }}>{NAMES.dry}</Td>
            <Td>{leftStats.dry}</Td>
            <Td>{formatPercent(leftStats.dry, totalLeft)}</Td>
            <Td>{rightStats.dry}</Td>
            <Td>{formatPercent(rightStats.dry, totalRight)}</Td>
            <Td>
              {((rightStats.dry / totalRight) - (leftStats.dry / totalLeft)) > 0 ? '+' : ''}
              {(((rightStats.dry / totalRight) - (leftStats.dry / totalLeft)) * 100).toFixed(1)}%
            </Td>
          </tr>
          <tr style={{ fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <Td>Total</Td>
            <Td>{totalLeft}</Td>
            <Td>100%</Td>
            <Td>{totalRight}</Td>
            <Td>100%</Td>
            <Td>-</Td>
          </tr>
        </tbody>
      </Table>
    );
  };
  
  return (
    <ModalOverlay isVisible={isOpen}>
      <ModalContent>
        <Button
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            backgroundColor: "#D32F2F",
            borderRadius: "50%",
            fontSize: 14,
            padding: "8px 10px",
          }}
          onClick={onClose}
        >
          <FaTimes />
        </Button>
        
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>
          Resultados da Análise
        </h2>
        
        <TabContainer style={{ marginBottom: '1.5rem' }}>
          <Tab 
            active={activeTab === "grafico"} 
            onClick={() => setActiveTab("grafico")}
          >
            <FaChartBar style={{ marginRight: '8px' }} />
            Gráficos
          </Tab>
          <Tab 
            active={activeTab === "tabela"} 
            onClick={() => setActiveTab("tabela")}
          >
            <FaTable style={{ marginRight: '8px' }} />
            Tabela
          </Tab>
        </TabContainer>
        
        {activeTab === "grafico" && (
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Comparação de Grãos</h3>
            {renderBarChart()}
            
            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Distribuição Percentual</h3>
            {renderPieCharts()}
          </div>
        )}
        
        {activeTab === "tabela" && (
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Análise Comparativa</h3>
            {renderTable()}
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ResultadosAnaliseRapida; 