import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  useColorScheme,
  Alert
} from 'react-native';
import {addFarm, getFarms, getPlots} from '../../api/index';
import BottomMenu from '../../components/commonComponents/BottomMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from '../../components/commonComponents/AppHeader';
import Buttons from '../../components/commonComponents/Button';
import { useNavigation } from '@react-navigation/native';
import RouteName from '../../routes/RouteName';

const FazendaScreen = () => {
  const [farmName, setFarmName] = useState('');
  const [message, setMessage] = useState(null);
  const [farms, setFarms] = useState([]);
  const scheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await getFarms(token, 1, 25, '');
        setFarms(response);
        if (response.length === 0) {
          Alert.alert(
            'Bem-vindo!',
            'Para prosseguir, você precisa cadastrar sua primeira fazenda.',
            [{ text: 'OK' }]
          );
        }
      } catch (e) {
        console.error('Erro ao obter fazendas:', e);
        setMessage(e.response?.data?.messages[0]?.message || 'Erro ao obter fazendas');
        if (e.response?.data?.messages[0]?.message === 'Acesso não autorizado') {
          await AsyncStorage.removeItem('accessToken');
          navigation.navigate(RouteName.LOGIN_SCREEN);
        }
      }
    };

    fetchFarms();
  }, []);


  const handleAddFarm = async () => {
    if (!farmName.trim()) {
      setMessage('Nome da fazenda é obrigatório.');
      return;
    }

    try {
      await addFarm(farmName);
      setFarmName('');
      setMessage('Fazenda adicionada com sucesso.');

      // Atualizar a lista de fazendas
      const response = await getFarms( 1, 25, '');
      setFarms(response);

      // Verificar se há talhões cadastrados
      const plotsResponse = await getPlots( 1, 25, '');
      if (plotsResponse.length === 0) {
        // Redirecionar para a tela de talhão, pois não existem talhões cadastrados
        Alert.alert(
          'Próximo Passo',
          'Agora, você precisa cadastrar um talhão.',
          [{ text: 'OK', onPress: () => navigation.navigate(RouteName.TALHAO_SCREEN) }]
        );
      }
    } catch (e) {
      setMessage('Erro ao adicionar a fazenda.');
    }
  };



  const dynamicStyles = styles(scheme);

  return (
    <View style={dynamicStyles.container}>
      <AppHeader />
      <Text style={dynamicStyles.title}>Gerenciar Fazendas</Text>
      <TextInput
        style={dynamicStyles.input}
        placeholder="Nome nova Fazenda"
        value={farmName}
        onChangeText={setFarmName}
        placeholderTextColor={scheme === 'dark' ? '#ccc' : '#999'}
      />
      {message && (
        <Text
          style={
            message.startsWith('Erro')
              ? dynamicStyles.error
              : dynamicStyles.success
          }>
          {message}
        </Text>
      )}
      <Buttons
        title="Adicionar Fazenda"
        onPress={handleAddFarm}
        buttonStyle={dynamicStyles.button}
        buttonTextStyle={dynamicStyles.buttonText}
        disabled={!farmName}
      />
      <FlatList
        data={farms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={dynamicStyles.farmItem}>
            <Text style={dynamicStyles.farmName}>{item.nome}</Text>
            <Text style={dynamicStyles.farmDate}>Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
          </View>
        )}
        contentContainerStyle={dynamicStyles.listContainer}
      />
      <BottomMenu />
    </View>
  );
};

const styles = (scheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      fontFamily: 'Poppins-Medium',
      backgroundColor: "#230C02",
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#fff',
    },
    input: {
      height: 40,
      width: '90%',
      borderColor: scheme === 'dark' ? '#777' : 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
      backgroundColor: scheme === 'dark' ? '#555' : '#fff',
      color: scheme === 'dark' ? '#fff' : '#000',
      alignSelf: 'center',
    },
    error: {
      color: 'red',
      marginBottom: 12,
      textAlign: 'center',
    },
    success: {
      color: 'green',
      marginBottom: 12,
      textAlign: 'center',
    },
    farmItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    farmName: {
      fontSize: 18,
      color: '#fff',
    },
    farmDate: {
      fontSize: 14,
      color: '#fff',
    },
    listContainer: {
      paddingBottom: 100,
    },
    button: {
      backgroundColor: '#4CAF50', // verde padrão
      borderRadius: 20,
      width: '60%',
      alignSelf: 'center',
      paddingVertical: 10,
    },
    buttonText: {
      color: '#fff',
      fontFamily: 'Poppins-Medium',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
  });

export default FazendaScreen;
