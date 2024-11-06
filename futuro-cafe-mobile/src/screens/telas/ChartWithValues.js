import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  StackedBarChart,
  XAxis,
  YAxis,
  Grid,
} from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg';
import * as scale from 'd3-scale';

const ChartWithValues = ({ selectedImages }) => {
  const { width, height } = useWindowDimensions();
  const orientation = width > height ? 'landscape' : 'portrait';

  // Definição do chartWidth conforme a orientação
  const chartWidth = Math.min(width * 0.9, 500); // Limita o tamanho máximo do gráfico para 500 e usa 90% da largura
  const chartHeight = height * 0.4; // 40% da altura disponível

  // Preparação dos dados para o gráfico
  const chartData = selectedImages.map((item) => ({
    green: parseFloat(((item.green / item.total) * 100).toFixed(2)),
    greenYellow: parseFloat(((item.greenYellow / item.total) * 100).toFixed(2)),
    cherry: parseFloat(((item.cherry / item.total) * 100).toFixed(2)),
    raisin: parseFloat(((item.raisin / item.total) * 100).toFixed(2)),
    dry: parseFloat(((item.dry / item.total) * 100).toFixed(2)),
  }));

  const colors = ['#34A853', '#FFD700', '#FF6347', '#8B4513', '#A9A9A9'];
  const keys = ['green', 'greenYellow', 'cherry', 'raisin', 'dry'];
  const contentInset = { top: 20, bottom: 20 };

  // Componente para renderizar os valores nas barras
  const Labels = ({ x, y, bandwidth, data }) =>
    data.map((item, index) => {
      let cumulative = 0;
      return keys.map((key) => {
        const value = item[key];
        cumulative += value;
        const xPos = x(index) + bandwidth / 2;
        const yPos = y(cumulative - value / 2);

        return (
          <SvgText
            key={`${index}-${key}`}
            x={xPos}
            y={yPos}
            fontSize="10"
            fill="#000"
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {value > 0 ? `${value}%` : ''}
          </SvgText>
        );
      });
    });

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <YAxis
          data={[0, 100]}
          style={styles.yAxis}
          contentInset={contentInset}
          svg={{ fontSize: 12, fill: '#000' }}
          numberOfTicks={5}
          formatLabel={(value) => `${value}%`}
        />
        <View style={styles.graphContainer}>
          <StackedBarChart
            style={{ height: chartHeight, width: chartWidth }}
            data={chartData}
            keys={keys}
            colors={colors}
            contentInset={contentInset}
            spacingInner={0.1} // Ajuste do espaçamento entre as colunas
            animate={true}
            animationDuration={500}
            gridMin={0}
            gridMax={100}
          >
            <Grid direction={Grid.Direction.HORIZONTAL} />
            <Labels />
          </StackedBarChart>
          <XAxis
            style={{ marginTop: 10, width: chartWidth }}
            data={chartData}
            formatLabel={(value, index) => chartData[index]?.label || ''}
            contentInset={{ left: 20, right: 20 }}
            svg={{ fontSize: 12, fill: '#000' }}
            scale={scale.scaleBand}
          />
        </View>
      </View>
      <View style={styles.legendContainer}>
        {keys.map((key, index) => (
          <View key={key} style={styles.legendItem}>
            <View
              style={[styles.legendColorBox, { backgroundColor: colors[index] }]}
            />
            <Text style={styles.legendLabel}>{key}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yAxis: {
    marginBottom: 30,
  },
  graphContainer: {
    marginLeft: 10,
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: 14,
    color: '#000',
  },
});

export default ChartWithValues;
