import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/commonComponents/AppHeader';
import BottomMenu from '../../components/commonComponents/BottomMenu';
import DropdownComponent from '../../components/commonComponents/DropDown';
import { SF, SH, Colors, Fonts } from '../../utils';
import { getPlots, getProjects, getGroups, addPlotAnalysis } from '../../api/index';
import { VectorIcon } from '../../components';

const PhotoCollectionScreen = () => {
  const [plots, setPlots] = useState([]);
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const scheme = useColorScheme();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const plotsResponse = await getPlots();
        const projectsResponse = await getProjects();
        const groupsResponse = await getGroups();

        setPlots(plotsResponse.result);
        setProjects(projectsResponse.result);
        setGroups(groupsResponse.result);
      } catch (e) {
        console.error('Erro ao obter dados iniciais:', e);
      }
    };

    fetchInitialData();
  }, []);

  const dynamicStyles = styles(scheme);

  const handleImageSelection = (response) => {
    if (response.didCancel) {
      console.log('Usuário cancelou a seleção de imagem');
    } else if (response.errorCode) {
      console.error('Erro na seleção de imagem:', response.errorMessage);
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar a imagem.');
    } else if (response.assets && response.assets.length > 0) {
      const newPhotos = response.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `photo_${new Date().getTime()}.jpg`
      }));

      // Limitar o número total de fotos a 10
      setPhotos((prevPhotos) => {
        const totalPhotos = [...prevPhotos, ...newPhotos];
        return totalPhotos.slice(0, 10);
      });

      console.log('Imagens selecionadas:', [...photos, ...newPhotos]);
    }
  };

  const handleTakePhoto = () => {
    launchCamera({ mediaType: 'photo', saveToPhotos: true }, handleImageSelection);
  };

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 }, handleImageSelection); // Limitar a seleção a 10 fotos
  };

  const handleRemovePhoto = (uri) => {
    setPhotos((prevPhotos) => prevPhotos.filter(photo => photo.uri !== uri));
  };

  const handleAnalyzePhotos = async () => {
    if (!selectedPlot) {
      Alert.alert('Erro', 'Por favor, selecione um talhão antes de enviar.');
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Erro', 'Nenhuma foto selecionada.');
      return;
    }

    setLoading(true); // Iniciar o carregamento

    try {
      for (let i = 0; i < photos.length; i++) {
        const formData = new FormData();
        const photo = photos[i];

        formData.append('imagem', {
          uri: photo.uri,
          type: photo.type,
          name: photo.name,
        });
        if (selectedProject) formData.append('projetoId', selectedProject.id);
        if (selectedGroup) formData.append('grupoId', selectedGroup.id);

        console.log(`Enviando imagem ${i + 1} de ${photos.length}:`, photo);

        // Enviar imagem para análise individualmente
        await addPlotAnalysis(selectedPlot.id, formData);
      }

      // Mostrar alerta ao usuário informando que as imagens estão sendo processadas
      Alert.alert(
        'Imagens em processamento',
        'As imagens enviadas estão sendo processadas e serão exibidas na tela de resultados em breve.',
        [{ text: 'OK', onPress: () => navigation.navigate('ResultsScreen', { selectedPlot: selectedPlot }) }]
      );

      setLoading(false); // Parar o carregamento após enviar todas as imagens

    } catch (error) {
      console.error('Erro ao enviar para análise:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar as imagens para análise.');
      setLoading(false);
    }
  };

  return (
    <View style={dynamicStyles.container}>
      <AppHeader />
      {showPhotoOptions ? (
        <ScrollView contentContainerStyle={dynamicStyles.content}>
          <Image source={require('../../../assets/PrevisaoColheita.png')} style={dynamicStyles.headerImage} />
          <Text style={dynamicStyles.title}>Coleta de Imagens</Text>
          <View style={dynamicStyles.photoOptions}>
            <TouchableOpacity style={dynamicStyles.photoButton} onPress={handleTakePhoto}>
              <VectorIcon name="camera" size={SF(25)} color="#fff" icon="FontAwesome" />
            </TouchableOpacity>
            <TouchableOpacity style={dynamicStyles.photoButton} onPress={handleChoosePhoto}>
              <VectorIcon name="image" size={SF(25)} color="#fff" icon="FontAwesome" />
            </TouchableOpacity>
          </View>
          <View style={dynamicStyles.photosContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={dynamicStyles.photoWrapper}>
                <Image source={{ uri: photo.uri }} style={dynamicStyles.photo} />
                <TouchableOpacity style={dynamicStyles.removeButton} onPress={() => handleRemovePhoto(photo.uri)}>
                  <VectorIcon name="close" size={SF(20)} color="#fff" icon="FontAwesome" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={dynamicStyles.buttonContainer}>
            <TouchableOpacity style={dynamicStyles.backButton} onPress={() => setShowPhotoOptions(false)}>
              <Text style={dynamicStyles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[dynamicStyles.button, photos.length === 0 && dynamicStyles.disabledButton]}
              onPress={handleAnalyzePhotos}
              disabled={photos.length === 0}
            >
              <Text style={dynamicStyles.buttonText}>Enviar para Análise</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={dynamicStyles.content}>
          <Image source={require('../../../assets/PrevisaoColheita.png')} style={dynamicStyles.headerImage} />
          <Text style={dynamicStyles.title}>Coleta de Imagens</Text>
          <Text style={dynamicStyles.subtitle}>Selecione o Talhão</Text>
          <DropdownComponent
            width="100%"
            data={plots}
            labelField="nome"
            valueField="id"
            placeholder="Selecione o talhão"
            value={selectedPlot}
            onChange={setSelectedPlot}
          />
          {selectedPlot && (
            <>
              <Text style={dynamicStyles.subtitle}>Vincular a um Projeto (Opcional)</Text>
              <DropdownComponent
                width="100%"
                data={projects}
                labelField="nome"
                valueField="id"
                placeholder="Selecione o projeto"
                value={selectedProject}
                onChange={setSelectedProject}
              />
              <Text style={dynamicStyles.subtitle}>Vincular a um Grupo (Opcional)</Text>
              <DropdownComponent
                width="100%"
                data={groups}
                labelField="nome"
                valueField="id"
                placeholder="Selecione o grupo"
                value={selectedGroup}
                onChange={setSelectedGroup}
              />
              <TouchableOpacity style={dynamicStyles.button} onPress={() => setShowPhotoOptions(true)}>
                <Text style={dynamicStyles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
      {loading && (
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={dynamicStyles.loadingText}>Processando...</Text>
        </View>
      )}
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
      alignItems: 'center',
    },
    headerImage: {
      width: '100%',
      height: 200,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#fff',
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 10,
      color: '#fff',
    },
    photoOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 20,
    },
    photoButton: {
      backgroundColor: '#34A853',
      padding: 20,
      borderRadius: 50,
      alignItems: 'center',
    },
    photosContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    photoWrapper: {
      position: 'relative',
      margin: 5,
    },
    photo: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    removeButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 15,
      padding: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 20,
    },
    button: {
      backgroundColor: '#34A853',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    disabledButton: {
      backgroundColor: '#ccc',
    },
    backButton: {
      backgroundColor: '#FF0000',
      borderRadius: 25,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    backButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: '#FFF',
      marginTop: 10,
      fontSize: 18,
    },
  });

export default PhotoCollectionScreen;
