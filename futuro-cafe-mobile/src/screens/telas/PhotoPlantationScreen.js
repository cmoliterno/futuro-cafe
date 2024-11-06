import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import plantationImage from '../../../assets/IdentificacaoPragas.png';

const PhotoPlantationScreen = () => {
  const [photo, setPhoto] = useState(null);
  const navigation = useNavigation();
  const scheme = useColorScheme(); // Detecta o tema do dispositivo

  const dynamicStyles = styles(scheme);

  const handleTakePhoto = () => {
    launchCamera({}, response => {
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  const handleChoosePhoto = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={dynamicStyles.container}>
      <Image source={plantationImage} style={dynamicStyles.image} />
      <Text style={dynamicStyles.title}>Coleta de Imagens</Text>
      <TouchableOpacity style={dynamicStyles.button} onPress={handleTakePhoto}>
        <Text style={dynamicStyles.buttonText}>Tirar Foto</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={dynamicStyles.button}
        onPress={handleChoosePhoto}>
        <Text style={dynamicStyles.buttonText}>Escolher da Galeria</Text>
      </TouchableOpacity>
      {photo && <Image source={{uri: photo}} style={dynamicStyles.photo} />}
      <TouchableOpacity
        style={dynamicStyles.button}
        onPress={() => navigation.navigate('ResultsScreen', {photo})}>
        <Text style={dynamicStyles.buttonText}>Analisar Foto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = scheme =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: scheme === 'dark' ? '#333' : '#f5f5f5', // Ajuste de cor de fundo baseado no tema
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: 200,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: scheme === 'dark' ? '#fff' : '#000',
    },
    button: {
      backgroundColor: '#34A853', // Verde para os botões
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginVertical: 5,
      alignItems: 'center',
      width: '80%',
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    photo: {
      width: '100%',
      height: 300,
      marginTop: 20,
    },
  });

export default PhotoPlantationScreen;
