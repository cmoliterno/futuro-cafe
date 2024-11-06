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
import { addProject, getProjects } from '../../api/index'; // Função API para adicionar e obter projetos
import BottomMenu from '../../components/commonComponents/BottomMenu';
import AppHeader from '../../components/commonComponents/AppHeader';
import Buttons from '../../components/commonComponents/Button';
import { useNavigation } from '@react-navigation/native';
import RouteName from '../../routes/RouteName';

const ProjetoScreen = () => {
  const [projectName, setProjectName] = useState('');
  const [message, setMessage] = useState(null);
  const [projects, setProjects] = useState([]);
  const scheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.result); // Ajuste aqui para pegar a propriedade correta da resposta
      } catch (e) {
        console.error('Erro ao obter projetos:', e);
        setMessage(e.response?.data?.messages[0]?.message || 'Erro ao obter projetos');
        if (e.response?.data?.messages[0]?.message === 'Acesso não autorizado') {
          await AsyncStorage.removeItem('accessToken');
          navigation.navigate(RouteName.LOGIN_SCREEN);
        }
      }
    };

    fetchProjects();
  }, []);

  const handleAddProject = async () => {
    if (!projectName.trim()) {
      setMessage('Nome do projeto é obrigatório.');
      return;
    }

    try {
      await addProject(projectName);
      setProjectName('');
      setMessage('Projeto adicionado com sucesso.');
      const response = await getProjects();
      setProjects(response.result);
    } catch (e) {
      setMessage('Erro ao adicionar o projeto.');
    }
  };

  const dynamicStyles = styles(scheme);

  return (
    <View style={dynamicStyles.container}>
      <AppHeader />
      <Text style={dynamicStyles.title}>Cadastrar Novo Projeto</Text>
      <TextInput
        style={dynamicStyles.input}
        placeholder="Nome do Projeto"
        value={projectName}
        onChangeText={setProjectName}
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
        title="Adicionar Projeto"
        onPress={handleAddProject}
        buttonStyle={dynamicStyles.button}
        buttonTextStyle={dynamicStyles.buttonText}
        disabled={!projectName}
      />
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={dynamicStyles.projectItem}>
            <Text style={dynamicStyles.projectName}>{item.nome}</Text>
            <Text style={dynamicStyles.projectDate}>Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
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
      paddingTop:50,
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
    projectItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    projectName: {
      fontSize: 18,
      color: '#fff',
    },
    projectDate: {
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

export default ProjetoScreen;
