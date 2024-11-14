import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AppHeader from '../../components/commonComponents/AppHeader';
import BottomMenu from '../../components/commonComponents/BottomMenu';
import Buttons from '../../components/commonComponents/Button';
import DropdownComponent from '../../components/commonComponents/DropDown';
import {
  getFarms,
  getPlots,
  getGroups,
  getProjects,
  getPlotAnalyses,
  addPlotAnalysis,
} from '../../api/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Checkbox from '@react-native-community/checkbox';

// Importe o componente ChartWithValues
import ChartWithValues from './ChartWithValues';
import VectoreIcons from '../../components/commonComponents/VectoreIcons'; // Ajuste o caminho se necessário

const ResultsScreen = () => {
  const route = useRoute();
  const [farms, setFarms] = useState([]);
  const [plots, setPlots] = useState([]);
  const [groups, setGroups] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [analysis, setAnalysis] = useState(null); // Inicialmente null
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOriginalImage, setSelectedOriginalImage] = useState(null); // Estado para a imagem original
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showComparisonChart, setShowComparisonChart] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(false); // Estado para controlar a exibição lado a lado
  const scheme = useColorScheme();

  // Obter as dimensões da janela para ajustar o gráfico dinamicamente
  const windowDimensions = Dimensions.get('window');
  const [orientation, setOrientation] = useState(
    windowDimensions.width > windowDimensions.height ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const resetSelections = () => {
      setSelectedFarm(null);
      setSelectedPlot(null);
      setAnalysis(null);
      setSelectedImages([]);
    };

    resetSelections();
    fetchFarmsAndPlots();

    // Listener para mudanças de orientação
    const handleOrientationChange = ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    };

    const subscription = Dimensions.addEventListener('change', handleOrientationChange);

    // Limpar o listener ao desmontar o componente
    return () => {
      subscription?.remove();
    };
  }, []);

  const fetchFarmsAndPlots = async () => {
    try {
      const farmsResponse = await getFarms();
      setFarms(farmsResponse);
    } catch (e) {
      console.error('Erro ao obter fazendas:', e);
    }
  };

  const fetchPlots = async (farmId) => {
    try {
      const plotsResponse = await getPlots(farmId);
      setPlots(plotsResponse);
    } catch (e) {
      console.error('Erro ao obter talhões:', e);
    }
  };

  const fetchGroupsAndProjects = async () => {
    try {
      const groupsResponse = await getGroups();
      const projectsResponse = await getProjects();
      setGroups(groupsResponse);
      setProjects(projectsResponse);
    } catch (e) {
      console.error('Erro ao obter grupos e projetos:', e);
    }
  };

  const fetchAnalysis = async () => {
    if (selectedPlot) {
      try {
        const analysisResponse = await getPlotAnalyses(selectedPlot.id);
        setAnalysis(analysisResponse.result);
      } catch (e) {
        console.error('Erro ao obter análises:', e);
      }
    }
  };

  const handleFarmChange = async (farm) => {
    setSelectedFarm(farm);
    setSelectedPlot(null);
    setAnalysis(null);
    setSelectedImages([]);
    await fetchPlots(farm.id);
    await fetchGroupsAndProjects();
  };

  const handlePlotChange = (plot) => {
    setSelectedPlot(plot);
  };

  const handleReanalyze = async (imageId) => {
    try {
      await addPlotAnalysis(selectedPlot.id, { imageId });
      await fetchAnalysis();
    } catch (e) {
      console.error('Erro ao reanalisar imagem:', e);
    }
  };

  const handleBackToFilter = () => {
    setSelectedPlot(null);
    setSelectedImages([]);
    setAnalysis(null);
  };

  const handleDownloadImage = async (url) => {
    const path = `${RNFS.DocumentDirectoryPath}/image.jpg`;

    try {
      await RNFS.downloadFile({ fromUrl: url, toFile: path }).promise;
      await Share.open({ url: `file://${path}` });
    } catch (e) {
      console.error('Erro ao baixar a imagem:', e);
    }
  };

  const handleImagePress = (item) => {
    setSelectedImage(item.imagemResultadoUrl);
    setSelectedItem(item);
    setIsSideBySide(false); // Redefinir o estado
    setModalVisible(true);
  };

  // Função para lidar com o novo ícone
  const handleImagePressSideBySide = (item) => {
    setSelectedImage(item.imagemResultadoUrl);
    setSelectedOriginalImage(item.imagemUrl); // Usa 'imagemUrl' para a imagem original
    setSelectedItem(item);
    setIsSideBySide(true);
    setModalVisible(true);
  };

  const handleImageSelect = (item) => {
    setSelectedImages((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      } else {
        if (prev.length >= 6) {
          Alert.alert(
            'Limite atingido',
            'Você pode selecionar no máximo 6 imagens para comparação.'
          );
          return prev;
        }
        return [...prev, item];
      }
    });
  };

  const handleCompare = () => {
    if (selectedImages.length === 0) {
      Alert.alert(
        'Selecione imagens',
        'Por favor, selecione pelo menos uma imagem para comparar.'
      );
      return;
    }
    setShowComparisonChart(true);
  };

  const handleFetchHarvest = () => {
    fetchAnalysis();
  };

  const dynamicStyles = styles(scheme);

  // Função para obter rótulo baseado na posição
  const getLabel = (index) => String.fromCharCode(65 + index); // A, B, C, ...

  return (
    <View style={dynamicStyles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={dynamicStyles.content}>
        {analysis === null ? (
          <>
            <Text style={dynamicStyles.title}>Selecione a Fazenda</Text>
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
              <>
                <Text style={dynamicStyles.title}>Selecione o Talhão</Text>
                <DropdownComponent
                  width="100%"
                  data={plots}
                  labelField="nome"
                  valueField="id"
                  placeholder="Selecione o talhão"
                  value={selectedPlot}
                  onChange={handlePlotChange}
                />
              </>
            )}
            {selectedPlot && (
              <Buttons
                title="Consultar Colheita"
                onPress={handleFetchHarvest}
                buttonStyle={dynamicStyles.fetchButton}
                buttonTextStyle={dynamicStyles.fetchButtonText}
              />
            )}
          </>
        ) : analysis.length === 0 ? (
          <>
            <Text style={dynamicStyles.title}>Nenhuma análise disponível</Text>
            <Buttons
              title="Fazer novo filtro"
              onPress={handleBackToFilter}
              buttonStyle={dynamicStyles.backButton}
              buttonTextStyle={dynamicStyles.backButtonText}
            />
          </>
        ) : (
          <>
            <Text style={dynamicStyles.title}>Resultados da Análise</Text>
            {analysis.map((item, index) => (
              <View key={index} style={dynamicStyles.analysisContainer}>
                <Text style={dynamicStyles.imageName}>{`IMG_ID_${item.id}`}</Text>
                <View style={dynamicStyles.imageContainer}>
                  <Image
                    source={{ uri: item.imagemResultadoUrl }}
                    style={dynamicStyles.image}
                    onError={(error) =>
                      console.error(
                        'Erro ao carregar a imagem:',
                        error.nativeEvent.error
                      )
                    }
                  />
                  {selectedImages.includes(item) && (
                    <Text style={dynamicStyles.imageLabel}>
                      {getLabel(selectedImages.indexOf(item))}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={dynamicStyles.expandIcon}
                    onPress={() => handleImagePress(item)}
                  >
                    <Icon name="expand" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <View style={dynamicStyles.resultsContainer}>
                  {/* ... resultados como antes ... */}
                  <View style={dynamicStyles.resultRow}>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#34A853' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Green: {((item.green / item.total) * 100).toFixed(2)}%
                      </Text>
                    </View>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#FFD700' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Green-Yellow:{' '}
                        {((item.greenYellow / item.total) * 100).toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                  <View style={dynamicStyles.resultRow}>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#FF6347' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Cherry: {((item.cherry / item.total) * 100).toFixed(2)}%
                      </Text>
                    </View>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#8B4513' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Raisin: {((item.raisin / item.total) * 100).toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                  <View style={dynamicStyles.resultRow}>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#A9A9A9' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Dry: {((item.dry / item.total) * 100).toFixed(2)}%
                      </Text>
                    </View>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#FFFFFF' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Total: {item.total}
                      </Text>
                    </View>
                  </View>
                  <Text style={dynamicStyles.resultText}>
                    Data da Análise:{' '}
                    {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                  <Text style={dynamicStyles.resultText}>
                    Fazenda: {selectedFarm?.nome}
                  </Text>
                  <Text style={dynamicStyles.resultText}>
                    Talhão: {selectedPlot?.nome}
                  </Text>
                  {item.grupoId && (
                    <Text style={dynamicStyles.resultText}>
                      Grupo:{' '}
                      {groups.find((group) => group.id === item.grupoId)?.nome}
                    </Text>
                  )}
                  {item.projetoId && (
                    <Text style={dynamicStyles.resultText}>
                      Projeto:{' '}
                      {projects.find(
                        (project) => project.id === item.projetoId
                      )?.nome}
                    </Text>
                  )}
                </View>
                <View style={dynamicStyles.buttonContainer}>
                  <View style={dynamicStyles.checkboxContainer}>
                    <Checkbox
                      value={selectedImages.includes(item)}
                      onValueChange={() => handleImageSelect(item)}
                      style={dynamicStyles.checkbox}
                    />
                    {selectedImages.includes(item) && (
                      <Text style={dynamicStyles.checkboxLabel}>
                        {getLabel(selectedImages.indexOf(item))}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={dynamicStyles.iconButton}
                    onPress={() => handleReanalyze(item.id)}
                  >
                    <Icon name="refresh" size={20} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={dynamicStyles.iconButton}
                    onPress={() => handleDownloadImage(item.imagemUrl)}
                  >
                    <Icon name="download" size={20} color="#FFF" />
                  </TouchableOpacity>
                  {/* Novo botão para visualizar imagens lado a lado */}
                  <TouchableOpacity
                    style={dynamicStyles.iconButton}
                    onPress={() => handleImagePressSideBySide(item)}
                  >
                    <Icon name="columns" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <Buttons
              title="Fazer novo filtro"
              onPress={handleBackToFilter}
              buttonStyle={dynamicStyles.backButton}
              buttonTextStyle={dynamicStyles.backButtonText}
            />
          </>
        )}
      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={dynamicStyles.modalContainer}>
          <TouchableOpacity
            style={dynamicStyles.closeButton}
            onPress={() => {
              setModalVisible(false);
              setIsSideBySide(false); // Redefine o estado ao fechar a modal
            }}
          >
            <Icon name="close" size={30} color="#FFF" />
          </TouchableOpacity>
          {isSideBySide ? (
            // Exibe apenas as imagens lado a lado, sem dados
            <View style={dynamicStyles.sideBySideContainer}>
              <Image
                source={{ uri: selectedOriginalImage }}
                style={dynamicStyles.sideImage}
              />
              <Image
                source={{ uri: selectedImage }}
                style={dynamicStyles.sideImage}
              />
            </View>
          ) : (
            // Exibe a imagem única com os dados, como antes
            <>
              <Image source={{ uri: selectedImage }} style={dynamicStyles.fullImage} />
              {selectedItem && (
                <View style={dynamicStyles.modalResultsContainer}>
                  <Text style={dynamicStyles.resultText}>
                    Fazenda: {selectedFarm?.nome}
                  </Text>
                  <Text style={dynamicStyles.resultText}>
                    Talhão: {selectedPlot?.nome}
                  </Text>
                  {selectedItem.grupoId && (
                    <Text style={dynamicStyles.resultText}>
                      Grupo:{' '}
                      {groups.find((group) => group.id === selectedItem.grupoId)?.nome}
                    </Text>
                  )}
                  {selectedItem.projetoId && (
                    <Text style={dynamicStyles.resultText}>
                      Projeto:{' '}
                      {projects.find(
                        (project) => project.id === selectedItem.projetoId
                      )?.nome}
                    </Text>
                  )}
                  {/* ... restante dos resultados ... */}
                  <View style={dynamicStyles.resultRow}>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#34A853' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Green:{' '}
                        {((selectedItem.green / selectedItem.total) * 100).toFixed(2)}%
                      </Text>
                    </View>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#FFD700' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Green-Yellow:{' '}
                        {((selectedItem.greenYellow / selectedItem.total) * 100).toFixed(
                          2
                        )}
                        %
                      </Text>
                    </View>
                  </View>
                  <View style={dynamicStyles.resultRow}>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#FF6347' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Cherry:{' '}
                        {((selectedItem.cherry / selectedItem.total) * 100).toFixed(2)}%
                      </Text>
                    </View>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#8B4513' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Raisin:{' '}
                        {((selectedItem.raisin / selectedItem.total) * 100).toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                  <View style={dynamicStyles.resultRow}>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#A9A9A9' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Dry:{' '}
                        {((selectedItem.dry / selectedItem.total) * 100).toFixed(2)}%
                      </Text>
                    </View>
                    <View style={dynamicStyles.resultItem}>
                      <View
                        style={[
                          dynamicStyles.colorBox,
                          { backgroundColor: '#FFFFFF' },
                        ]}
                      />
                      <Text style={dynamicStyles.resultText}>
                        Total: {selectedItem.total}
                      </Text>
                    </View>
                  </View>
                  <Text style={dynamicStyles.resultText}>
                    Data da Análise:{' '}
                    {new Date(selectedItem.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </Modal>
      {selectedImages.length > 0 && (
        <TouchableOpacity style={dynamicStyles.fab} onPress={handleCompare}>
          <VectoreIcons icon="FontAwesome5" name="chart-bar" color="#FFF" size={30} />
        </TouchableOpacity>
      )}
      {showComparisonChart && (
        <Modal visible={true} transparent={false} animationType="slide">
          <View style={dynamicStyles.chartContainer}>
            <TouchableOpacity
              style={dynamicStyles.closeButton}
              onPress={() => setShowComparisonChart(false)}
            >
              <Icon name="close" size={30} color="#FFF" />
            </TouchableOpacity>
            <Text style={dynamicStyles.chartInfoText}>
              Gire o dispositivo para uma melhor visualização do gráfico.
            </Text>
            <ScrollView
              contentContainerStyle={dynamicStyles.chartScrollContainer}
              horizontal={false}
            >
              <ChartWithValues selectedImages={selectedImages} />
            </ScrollView>
          </View>
        </Modal>
      )}
      <View style={dynamicStyles.bottomMenuContainer}>
        <BottomMenu />
      </View>
    </View>
  );
};

const styles = (scheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#230C02',
    },
    content: {
      padding: 16,
      paddingBottom: 100,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#fff',
    },
    analysisContainer: {
      width: '100%',
      marginBottom: 20,
      alignItems: 'center',
      backgroundColor: '#3E2723',
      padding: 16,
      borderRadius: 10,
    },
    imageName: {
      color: '#fff',
      marginBottom: 10,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: 200,
      marginBottom: 10,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    imageLabel: {
      position: 'absolute',
      bottom: 5,
      left: 5,
      color: '#FFF',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 2,
      borderRadius: 4,
    },
    expandIcon: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 20,
      padding: 5,
    },
    resultsContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    resultRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 5,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '50%',
    },
    colorBox: {
      width: 20,
      height: 20,
      marginRight: 5,
    },
    resultText: {
      fontSize: 18,
      color: '#fff',
      marginVertical: 2,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      alignSelf: 'center',
    },
    checkboxLabel: {
      marginLeft: 8,
      color: '#fff',
      fontSize: 18,
    },
    iconButton: {
      backgroundColor: '#34A853',
      borderRadius: 25,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginTop: 10,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
    },
    backButton: {
      backgroundColor: '#34A853',
      borderRadius: 25,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginTop: 20,
    },
    backButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
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
    bottomMenuContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    fullImage: {
      width: '100%',
      height: '70%',
      borderRadius: 10,
      marginBottom: 20,
    },
    closeButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 1,
    },
    modalResultsContainer: {
      alignItems: 'center',
      backgroundColor: '#3E2723',
      borderRadius: 10,
      padding: 10,
      width: '100%',
    },
    fab: {
      position: 'absolute',
      bottom: 100,
      right: 20,
      backgroundColor: '#FFA500', // Laranja
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    chartWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    chartContainer: {
      flex: 1,
      backgroundColor: '#230C02',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    chartScrollContainer: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    chartInfoText: {
      color: '#FFF',
      fontSize: 15,
      textAlign: 'center',
    },
    // Novos estilos para as imagens lado a lado
    sideBySideContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '70%',
      marginBottom: 20,
    },
    sideImage: {
      width: '48%',
      height: '100%',
      borderRadius: 10,
    },
  });

export default ResultsScreen;
