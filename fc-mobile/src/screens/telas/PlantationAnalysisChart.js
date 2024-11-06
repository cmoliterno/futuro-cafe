import React from 'react';
import {View, Dimensions, StyleSheet, useColorScheme} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const PlantationAnalysisChart = () => {
  const screenWidth = Dimensions.get('window').width;
  const scheme = useColorScheme(); // Detecta o tema claro ou escuro

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: scheme === 'dark' ? '#383838' : '#ffffff',
    backgroundGradientTo: scheme === 'dark' ? '#383838' : '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(53, 53, 53, ${opacity})`, // Ajuste para melhor visibilidade em ambos os temas
    labelColor: (opacity = 1) => `rgba(53, 53, 53, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const dynamicStyles = styles(scheme);

  return (
    <View style={dynamicStyles.container}>
      <LineChart
        data={data}
        width={screenWidth - 32} // Ajusta a largura para o padding do container
        height={220}
        chartConfig={chartConfig}
        style={dynamicStyles.chart}
      />
    </View>
  );
};

const styles = scheme =>
  StyleSheet.create({
    container: {
      marginVertical: 16,
      borderRadius: 16,
      backgroundColor: scheme === 'dark' ? '#2c2c2c' : '#F3EFE5', // Background color adjusted for dark mode
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    chart: {
      marginVertical: 8,
      borderRadius: 16,
    },
  });

export default PlantationAnalysisChart;
