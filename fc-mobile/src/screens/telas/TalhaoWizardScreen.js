import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/commonComponents/AppHeader';
import BottomMenu from '../../components/commonComponents/BottomMenu';
import Buttons from '../../components/commonComponents/Button';
import DropdownComponent from '../../components/commonComponents/DropDown';
import { getFarms, getPlots, getPlotAnalyses } from '../../api/index';
import { StackedBarChart, XAxis, YAxis, Grid } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg';
import * as scale from 'd3-scale';
import RouteName from "../../routes/RouteName";

const colors = ['#34A853', '#FFD700', '#FF6347', '#8B4513', '#A9A9A9']; // Cores das colunas
const keys = ['green', 'greenYellow', 'cherry', 'raisin', 'dry'];

const TalhaoWizardScreen = () => {
  const [farms, setFarms] = useState([]);
  const [plots, setPlots] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [queryOption, setQueryOption] = useState(null); // 'farm' ou 'date'

  // Estado para filtro de data
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const navigation = useNavigation();
  const windowDimensions = Dimensions.get('window');

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const farmsResponse = await getFarms();
        setFarms(farmsResponse);
      } catch (e) {
        console.error('Erro ao obter fazendas:', e);
      }
    };
    fetchFarms();
  }, []);

  const fetchPlots = async (farmId) => {
    try {
      const plotsResponse = await getPlots(farmId);
      setPlots(plotsResponse);
    } catch (e) {
      console.error('Erro ao obter talhões:', e);
    }
  };

  const handleFarmChange = async (farm) => {
    setSelectedFarm(farm);
    setSelectedPlot(null);
    setChartData([]);
    await fetchPlots(farm.id);
  };

  const handlePlotChange = (plot) => {
    setSelectedPlot(plot);
  };

  const handleFetchData = async () => {
    if (!selectedFarm) {
      Alert.alert('Seleção Incompleta', 'Por favor, selecione uma fazenda.');
      return;
    }

    setLoading(true);

    try {
      if (queryOption === 'farm') {
        // Consulta por Fazenda
        // Obter todos os talhões da fazenda selecionada
        const plotsResponse = await getPlots(selectedFarm.id);
        if (plotsResponse) {
          const allPlots = plotsResponse;
          // Obter análises de todos os talhões para o mês corrente
          const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          const currentDate = new Date();
          let allAnalyses = [];

          for (const plot of allPlots) {
            const analysisResponse = await getPlotAnalyses(plot.id, currentMonthStart, currentDate);
            if (analysisResponse) {
              allAnalyses = allAnalyses.concat(
                analysisResponse.result.map((analysis) => ({ ...analysis, plotName: plot.nome }))
              );
            }
          }

          if (allAnalyses.length > 0) {
            processChartDataByPlot(allAnalyses);
          } else {
            Alert.alert('Sem Dados', 'Nenhuma análise encontrada para esta fazenda no mês corrente.');
          }
        } else {
          Alert.alert('Erro', 'Não foi possível obter os talhões da fazenda.');
        }
      } else if (queryOption === 'date') {
        // Consulta por Data
        if (!selectedPlot || !startDate || !endDate) {
          Alert.alert('Seleção Incompleta', 'Por favor, selecione um talhão e um intervalo de datas.');
          setLoading(false);
          return;
        }

        // Validar período de até 7 dias
        const start = new Date(startDate.setHours(0, 0, 0, 0));
        const end = new Date(endDate.setHours(0, 0, 0, 0));
        const diffTime = end.getTime() - start.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24) + 1; // Adiciona 1 para incluir o dia final

        if (diffDays > 7) {
          Alert.alert('Período Excedido', 'O período máximo de consulta é de 7 dias.');
          setLoading(false);
          return;
        }

        // Validar se a data final não é no futuro
        const currentDate = new Date().setHours(0, 0, 0, 0);
        if (end > currentDate) {
          Alert.alert('Data Inválida', 'A data final não pode ser no futuro.');
          setLoading(false);
          return;
        }

        const analysisResponse = await getPlotAnalyses(selectedPlot.id, startDate, endDate);
        if (analysisResponse.success) {
          let analyses = analysisResponse.result;

          // Filtrar análises dentro do período selecionado
          analyses = analyses.filter((item) => {
            const analysisDate = new Date(item.createdAt).setHours(0, 0, 0, 0);
            return analysisDate >= start && analysisDate <= end;
          });

          // Ordenar as análises por data
          analyses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

          if (analyses.length > 0) {
            processChartData(analyses);
          } else {
            Alert.alert('Sem Dados', 'Nenhuma análise encontrada para este talhão no período selecionado.');
          }
        } else {
          Alert.alert('Erro', 'Não foi possível obter as análises.');
        }
      }
    } catch (e) {
      console.error('Erro ao obter análises:', e);
      Alert.alert('Erro', 'Não foi possível carregar as análises.');
    } finally {
      setLoading(false);
    }
  };

  // Processar dados para gráfico por talhão (Consulta por Fazenda)
  const processChartDataByPlot = (analyses) => {
    const plotDataMap = {};

    analyses.forEach((item) => {
      const plotName = item.plotName;
      if (!plotDataMap[plotName]) {
        plotDataMap[plotName] = {
          green: 0,
          greenYellow: 0,
          cherry: 0,
          raisin: 0,
          dry: 0,
          total: 0,
          label: plotName,
        };
      }
      plotDataMap[plotName].green += item.green;
      plotDataMap[plotName].greenYellow += item.greenYellow;
      plotDataMap[plotName].cherry += item.cherry;
      plotDataMap[plotName].raisin += item.raisin;
      plotDataMap[plotName].dry += item.dry;
      plotDataMap[plotName].total += item.total;
    });

    const chartData = Object.values(plotDataMap).map((item) => ({
      label: item.label,
      green: parseFloat(((item.green / item.total) * 100).toFixed(2)),
      greenYellow: parseFloat(((item.greenYellow / item.total) * 100).toFixed(2)),
      cherry: parseFloat(((item.cherry / item.total) * 100).toFixed(2)),
      raisin: parseFloat(((item.raisin / item.total) * 100).toFixed(2)),
      dry: parseFloat(((item.dry / item.total) * 100).toFixed(2)),
    }));

    setChartData(chartData);
  };

  // Processar dados para gráfico por dia (Consulta por Data)
  const processChartData = (analyses) => {
    if (!analyses || analyses.length === 0) {
      Alert.alert('Sem Dados', 'Nenhuma análise encontrada para este talhão.');
      return;
    }

    const chartData = analyses.map((item) => ({
      label: formatDate(new Date(item.createdAt)),
      green: parseFloat(((item.green / item.total) * 100).toFixed(2)),
      greenYellow: parseFloat(((item.greenYellow / item.total) * 100).toFixed(2)),
      cherry: parseFloat(((item.cherry / item.total) * 100).toFixed(2)),
      raisin: parseFloat(((item.raisin / item.total) * 100).toFixed(2)),
      dry: parseFloat(((item.dry / item.total) * 100).toFixed(2)),
    }));

    setChartData(chartData);
  };

  // Renderizar os valores nas barras
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

  const formatDate = (date) => {
    const day = ('0' + date.getDate()).slice(-2); // Obtém o dia e adiciona zero à esquerda se necessário
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Obtém o mês e adiciona zero à esquerda
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderChart = () => {
    const data = chartData;
    return (
      <View style={dynamicStyles.chartContainer}>
        {/* Título do Gráfico */}
        <Text style={dynamicStyles.chartTitle}>
          {queryOption === 'farm' ? 'Consolidado por Talhão' : 'Evolução Diária'}
        </Text>
        {/* Texto com o período de consulta */}
        {queryOption === 'date' && startDate && endDate && (
          <Text style={dynamicStyles.periodText}>
            Período: {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <YAxis
            data={[0, 100]}
            style={dynamicStyles.yAxis}
            contentInset={{ top: 20, bottom: 20 }}
            svg={{ fontSize: 12, fill: '#000' }}
            numberOfTicks={5}
            formatLabel={(value) => `${value}%`}
          />
          <StackedBarChart
            style={{ height: 220, width: windowDimensions.width - 32 }}
            data={data}
            keys={keys}
            colors={colors}
            contentInset={{ top: 20, bottom: 20 }}
            animate={true}
            spacingInner={0.1}
            spacingOuter={0}
          >
            <Grid direction={Grid.Direction.HORIZONTAL} />
            <Labels />
          </StackedBarChart>
        </View>
      </View>
    );
  };
  const dynamicStyles = styles();

  return (
    <View style={dynamicStyles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={dynamicStyles.content}>
        <View style={dynamicStyles.header}>
          <TouchableOpacity onPress={() => navigation.navigate(RouteName.HOME_SCREEN)} style={dynamicStyles.backButton}>
            <Icon name="arrow-left" size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={dynamicStyles.title}>Previsão Data Colheita</Text>
        </View>

        {/* Opções de Consulta */}
        <View style={dynamicStyles.optionContainer}>
          <Text style={dynamicStyles.optionLabel}>Escolha uma opção de consulta:</Text>
          <View style={dynamicStyles.buttonGroup}>
            <TouchableOpacity
              style={[
                dynamicStyles.optionButton,
                queryOption === 'farm' && dynamicStyles.selectedOptionButton,
              ]}
              onPress={() => {
                setQueryOption('farm');
                setSelectedFarm(null);
                setSelectedPlot(null);
                setChartData([]);
              }}
            >
              <Text style={dynamicStyles.optionButtonText}>Por Fazenda</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                dynamicStyles.optionButton,
                queryOption === 'date' && dynamicStyles.selectedOptionButton,
              ]}
              onPress={() => {
                setQueryOption('date');
                setSelectedFarm(null);
                setSelectedPlot(null);
                setStartDate(null);
                setEndDate(null);
                setChartData([]);
              }}
            >
              <Text style={dynamicStyles.optionButtonText}>Por Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Campos de Seleção conforme a opção */}
        {queryOption === 'farm' && (
          <>
            <DropdownComponent
              width="100%"
              data={farms}
              labelField="nome"
              valueField="id"
              placeholder="Selecione a fazenda"
              value={selectedFarm}
              onChange={handleFarmChange}
            />
          </>
        )}

        {queryOption === 'date' && (
          <>
            <DropdownComponent
              width="100%"
              data={farms}
              labelField="nome"
              valueField="id"
              placeholder="Selecione a fazenda"
              value={selectedFarm}
              onChange={handleFarmChange}
            />
            {selectedFarm && (
              <DropdownComponent
                width="100%"
                data={plots}
                labelField="nome"
                valueField="id"
                placeholder="Selecione o talhão"
                value={selectedPlot}
                onChange={handlePlotChange}
              />
            )}
            {selectedPlot && (
              <>
                <View style={dynamicStyles.dateContainer}>
                  <Text style={dynamicStyles.dateLabel}>Data Inicial</Text>
                  <TouchableOpacity
                    onPress={() => setShowStartPicker(true)}
                    style={dynamicStyles.datePickerButton}
                  >
                    <Text style={dynamicStyles.datePickerText}>
                      {startDate ? formatDate(startDate) : 'Selecione a data'}
                    </Text>

                  </TouchableOpacity>
                  {showStartPicker && (
                    <DateTimePicker
                      value={startDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowStartPicker(false);
                        setStartDate(selectedDate || startDate);
                      }}
                    />
                  )}
                </View>

                <View style={dynamicStyles.dateContainer}>
                  <Text style={dynamicStyles.dateLabel}>Data Final</Text>
                  <TouchableOpacity
                    onPress={() => setShowEndPicker(true)}
                    style={dynamicStyles.datePickerButton}
                  >
                    <Text style={dynamicStyles.datePickerText}>
                      {endDate ? endDate.toLocaleDateString() : 'Selecione a data'}
                    </Text>
                  </TouchableOpacity>
                  {showEndPicker && (
                    <DateTimePicker
                      value={endDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowEndPicker(false);
                        setEndDate(selectedDate || endDate);
                      }}
                    />
                  )}
                </View>
              </>
            )}
          </>
        )}

        {/* Botão de Consultar Análises */}
        {((queryOption === 'farm' && selectedFarm) ||
          (queryOption === 'date' && selectedPlot && startDate && endDate)) && (
          <Buttons
            title="Consultar Análises"
            onPress={handleFetchData}
            buttonStyle={dynamicStyles.fetchButton}
            buttonTextStyle={dynamicStyles.fetchButtonText}
          />
        )}

        {loading && <ActivityIndicator size="large" color="#FFA500" />}

        {/* Botão para exibir o gráfico */}
        {chartData.length > 0 && !loading && (
          <>
            <Buttons
              title="Ver Gráfico"
              onPress={() => setModalVisible(true)}
              buttonStyle={dynamicStyles.fetchButton}
              buttonTextStyle={dynamicStyles.fetchButtonText}
            />

            {/* Modal para exibir o gráfico */}
            <Modal visible={modalVisible} transparent={false} animationType="slide">
              <View style={dynamicStyles.modalContainer}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={dynamicStyles.closeButton}>
                  <Icon name="close" size={30} color="#FFF" />
                </TouchableOpacity>

                {renderChart()}

                {/* Legenda */}
                <View style={dynamicStyles.legendContainer}>
                  {keys.map((key, index) => (
                    <View key={key} style={dynamicStyles.legendItem}>
                      <View style={[dynamicStyles.legendColorBox, { backgroundColor: colors[index] }]} />
                      <Text style={dynamicStyles.legendLabel}>{key}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Modal>
          </>
        )}
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#230C02',
    },
    content: {
      padding: 16,
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    backButton: {
      width: 25,
      alignItems: 'flex-start',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    chartContainer: {
      marginVertical: 20,
      borderRadius: 16,
      backgroundColor: '#fff',
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chartTitle: {
      fontSize: 18,
      color: '#000',
      textAlign: 'center',
      marginBottom: 5,
      fontWeight: 'bold',
    },
    periodText: {
      fontSize: 16,
      color: '#000',
      textAlign: 'center',
      marginBottom: 10,
    },
    yAxis: {
      // Ajuste conforme necessário
    },
    graphContainer: {
      marginLeft: 10,
      alignItems: 'center',
    },
    fetchButton: {
      backgroundColor: '#FFA500',
      borderRadius: 25,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginTop: 20,
    },
    fetchButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    dateContainer: {
      marginTop: 20,
      width: '100%',
    },
    dateLabel: {
      fontSize: 16,
      color: '#fff',
      marginBottom: 10,
    },
    datePickerButton: {
      padding: 10,
      backgroundColor: '#3E2723',
      borderRadius: 8,
    },
    datePickerText: {
      color: '#fff',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: '#230C02',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 20,
      right: 20,
    },
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    legendColorBox: {
      width: 20,
      height: 20,
      marginRight: 8,
    },
    legendLabel: {
      fontSize: 14,
      color: '#fff',
    },
    graphTitle: {
      fontSize: 18,
      color: '#fff',
      marginVertical: 10,
      textAlign: 'center',
    },
    optionContainer: {
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
    },
    optionLabel: {
      fontSize: 16,
      color: '#fff',
      marginBottom: 10,
    },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    optionButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#3E2723',
      borderRadius: 8,
      marginHorizontal: 5,
    },
    selectedOptionButton: {
      backgroundColor: '#FFA500',
    },
    optionButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  });

export default TalhaoWizardScreen;
