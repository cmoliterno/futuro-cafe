import React from 'react';
import { View, Text, StyleSheet, Image, useColorScheme } from 'react-native';
import pestsImage from '../../../assets/IdentificacaoPragas.png';
import AppHeader from '../../components/commonComponents/AppHeader';
import BottomMenu from '../../components/commonComponents/BottomMenu';

const PhotoPestsScreen = () => {
  const scheme = useColorScheme(); // Detecta o tema do dispositivo

  const dynamicStyles = styles(scheme);

  return (
    <View style={dynamicStyles.container}>
      <AppHeader />
      <View style={dynamicStyles.content}>
        <Image source={pestsImage} style={dynamicStyles.image} />
        <Text style={dynamicStyles.title}>Coleta de Imagens</Text>
        <Text style={dynamicStyles.message}>
          Esta funcionalidade está em desenvolvimento e será disponibilizada em breve.
        </Text>
      </View>
      <BottomMenu />
    </View>
  );
};

const styles = scheme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#230C02',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
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
    message: {
      fontSize: 18,
      color: scheme === 'dark' ? '#fff' : '#000',
      textAlign: 'center',
      paddingHorizontal: 20,
    },
  });

export default PhotoPestsScreen;
