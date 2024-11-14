// src/screens/TalhaoScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    useColorScheme,
    FlatList, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFarms, getPlots, addPlot, getAllCultivars } from "../../api/index";
import AppHeader from '../../components/commonComponents/AppHeader';
import BottomMenu from '../../components/commonComponents/BottomMenu';
import Buttons from '../../components/commonComponents/Button';
import { SF, SH, Colors, Fonts } from '../../utils';
import { RouteName } from '../../routes';
import DropdownComponent from '../../components/commonComponents/DropDown';
import { VectorIcon } from '../../components';
import CustomDatePicker from '../../components/commonComponents/DatePicker';
import { TextInputMask } from 'react-native-masked-text';
import MapComponent from '../../components/commonComponents/MapComponent';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

const TalhaoScreen = () => {
  const [plots, setPlots] = useState([]);
  const [farms, setFarms] = useState([]);
  const [cultivars, setCultivars] = useState([]);
  const [showNewPlotForm, setShowNewPlotForm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedCultivar, setSelectedCultivar] = useState(null);
  const [plantingDate, setPlantingDate] = useState(new Date());
  const [plotName, setPlotName] = useState('');
  const [spacingRows, setSpacingRows] = useState('');
  const [spacingPlants, setSpacingPlants] = useState('');
  const [coordinates, setCoordinates] = useState([]); // Novo estado para coordenadas
  const [showMapModal, setShowMapModal] = useState(false); // Estado para exibir o modal do mapa
  const [message, setMessage] = useState(null);
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const farmsResponse = await getFarms();
        const plotsResponse = await getPlots();
        const cultivarsResponse = await getAllCultivars();
        setFarms(farmsResponse);
        setPlots(plotsResponse);
        setCultivars(cultivarsResponse);
      } catch (e) {
        console.error('Erro ao obter fazendas, talhões ou cultivares:', e);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Permissão de localização',
              message: 'O app precisa acessar sua localização.',
              buttonNeutral: 'Pergunte-me depois',
              buttonNegative: 'Cancelar',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getLocation();
          } else {
            console.log('Permissão de localização negada');
          }
        } else {
          getLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const getLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    requestLocationPermission();
  }, []);

  const handleAddPlot = async () => {
    // if (!plotName || !selectedFarm || !selectedCultivar || !spacingRows || !spacingPlants || coordinates.length === 0) {
    //   setMessage('Todos os campos são obrigatórios e o talhão deve ser desenhado.');
    //   return;
    // }
    if (!plotName || !selectedFarm || !selectedCultivar || !spacingRows || !spacingPlants) {
      setMessage('Todos os campos são obrigatórios.');
      return;
    }

    try {
      // Simulação de envio de dados para adicionar o talhão (substitua por sua função de API)
      await addPlot(plotName, selectedCultivar.id, plantingDate.toISOString().split('T')[0], parseFloat(spacingRows.replace(',', '.')), parseFloat(spacingPlants.replace(',', '.')), selectedFarm.id, coordinates);

      setMessage('Talhão adicionado com sucesso.');
      setShowNewPlotForm(false);
      const plotsResponse = await getPlots();
      setPlots(plotsResponse);

        Alert.alert(
            'Próximo Passo',
            'Agora, você esta preparado para coletar as imagens.',
            [{ text: 'OK', onPress: () => navigation.navigate(RouteName.PHOTO_COLLECTION_SCREEN) }]
        );
    } catch (e) {
      console.error('Erro ao adicionar talhão:', e);
      setMessage('Erro ao adicionar talhão.');
    }
  };

  const renderPlotItem = ({ item }) => (
    <View style={dynamicStyles.plotItem}>
      <Text style={dynamicStyles.plotName}>{item.nome}</Text>
      <Text style={dynamicStyles.plotDate}>Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
    </View>
  );

  const dynamicStyles = styles(scheme);

  return (
    <View style={dynamicStyles.container}>
      <AppHeader />
      {showNewPlotForm ? (
        <ScrollView contentContainerStyle={dynamicStyles.content}>
          <Text style={dynamicStyles.plotName}>Nome do Talhão</Text>
          <TextInput
            style={dynamicStyles.input}
            placeholder="Nome do Talhão"
            value={plotName}
            onChangeText={setPlotName}
          />
          <Text style={dynamicStyles.plotName}>Fazenda</Text>
          <DropdownComponent
            width="100%"
            data={farms}
            labelField="nome"
            valueField="id"
            placeholder="Selecione a fazenda"
            value={selectedFarm}
            onChange={setSelectedFarm}
          />
          <Text style={dynamicStyles.plotName}>Data do Plantio</Text>
          <CustomDatePicker date={plantingDate} onChange={setPlantingDate} />
          <Text style={dynamicStyles.plotName}>Cultivar</Text>
          <DropdownComponent
            width="100%"
            data={cultivars}
            labelField="nome"
            valueField="id"
            placeholder="Selecione o cultivar"
            value={selectedCultivar}
            onChange={setSelectedCultivar}
          />
          <View style={dynamicStyles.spacingContainer}>
            <Text style={dynamicStyles.plotName}>Espaçamento</Text>
            <TextInputMask
              type={'custom'}
              options={{
                mask: '9,99',
              }}
              value={spacingRows}
              onChangeText={setSpacingRows}
              style={dynamicStyles.input}
              placeholder="Linhas (entre 3 e 3,8m)"
            />
            <TextInputMask
              type={'custom'}
              options={{
                mask: '9,99',
              }}
              value={spacingPlants}
              onChangeText={setSpacingPlants}
              style={dynamicStyles.input}
              placeholder="Mudas (entre 0,6 e 0,8m)"
            />
          </View>
          <Buttons
            title="Desenhar Talhão no Mapa"
            onPress={() => setShowMapModal(true)}
            buttonStyle={dynamicStyles.button}
            buttonTextStyle={dynamicStyles.buttonText}
          />
          <Buttons
            title="Adicionar Talhão"
            onPress={handleAddPlot}
            buttonStyle={dynamicStyles.button}
            buttonTextStyle={dynamicStyles.buttonText}
          />
          {message && <Text style={dynamicStyles.message}>{message}</Text>}
        </ScrollView>
      ) : (
        <>
          <View style={dynamicStyles.header}>
            <Text style={dynamicStyles.headerTitle}>Talhões</Text>
            <TouchableOpacity onPress={() => setShowNewPlotForm(true)} style={dynamicStyles.addButton}>
              <VectorIcon name="plus" size={SF(25)} color="#fff" icon="Entypo" />
              <Text style={dynamicStyles.addButtonText}>Novo Talhão</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={plots}
            keyExtractor={(item) => item.id}
            renderItem={renderPlotItem}
            contentContainerStyle={dynamicStyles.listContainer}
          />
        </>
      )}

      <Modal visible={showMapModal} transparent={false} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapComponent initialLocation={userLocation} onCoordinatesChange={setCoordinates} />
          <Buttons
            title="Salvar Desenho"
            onPress={() => setShowMapModal(false)}
            buttonStyle={dynamicStyles.button}
            buttonTextStyle={dynamicStyles.buttonText}
          />
        </View>
      </Modal>

      <BottomMenu />
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
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      backgroundColor: scheme === 'dark' ? '#555' : '#fff',
      color: scheme === 'dark' ? '#fff' : '#000',
      borderRadius: 10,
      fontSize: 16,
    },
    plotItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    plotName: {
      fontSize: 18,
      color: '#fff',
      marginBottom: 10,
    },
    plotDate: {
      fontSize: 14,
      color: '#ccc',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#230C02',
    },
    headerTitle: {
      fontSize: 24,
      color: '#fff',
    },
    addButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 18,
      marginLeft: 5,
    },
    message: {
      textAlign: 'center',
      color: 'red',
      marginTop: 10,
    },
    button: {
      backgroundColor: '#4CAF50',
      borderRadius: 20,
      paddingVertical: 15,
      marginBottom: 20,
      width: '80%',
      alignSelf: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    listContainer: {
      paddingBottom: 100,
    },
    spacingContainer: {
      marginBottom: 20,
    },
  });

export default TalhaoScreen;
