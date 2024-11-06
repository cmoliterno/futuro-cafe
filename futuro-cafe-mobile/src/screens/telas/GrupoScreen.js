import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  useColorScheme,
} from 'react-native';
import { addGroup, getGroups } from '../../api/index'; // Função API para adicionar e obter grupos
import BottomMenu from '../../components/commonComponents/BottomMenu';
import AppHeader from '../../components/commonComponents/AppHeader';
import Buttons from '../../components/commonComponents/Button';

const GrupoScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState(null);
  const [groups, setGroups] = useState([]);
  const scheme = useColorScheme();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getGroups();
        setGroups(response.result); // Ajuste para pegar a propriedade correta da resposta
      } catch (e) {
        console.error('Erro ao obter grupos:', e);
        setMessage(e.response?.data?.messages[0]?.message || 'Erro ao obter grupos');
      }
    };

    fetchGroups();
  }, []);

  const handleAddGroup = async () => {
    if (!groupName.trim()) {
      setMessage('Nome do grupo é obrigatório.');
      return;
    }

    try {
      await addGroup(groupName);
      setGroupName('');
      setMessage('Grupo adicionado com sucesso.');
      const response = await getGroups();
      setGroups(response.result);
    } catch (e) {
      setMessage('Erro ao adicionar o grupo.');
    }
  };

  const dynamicStyles = styles(scheme);

  return (
    <View style={dynamicStyles.container}>
      <AppHeader />
      <Text style={dynamicStyles.title}>Cadastrar Novo Grupo</Text>
      <TextInput
        style={dynamicStyles.input}
        placeholder="Nome do Grupo"
        value={groupName}
        onChangeText={setGroupName}
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
        title="Adicionar Grupo"
        onPress={handleAddGroup}
        buttonStyle={dynamicStyles.button}
        buttonTextStyle={dynamicStyles.buttonText}
        disabled={!groupName}
      />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={dynamicStyles.groupItem}>
            <Text style={dynamicStyles.groupName}>{item.nome}</Text>
            <Text style={dynamicStyles.groupDate}>Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
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
    groupItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    groupName: {
      fontSize: 18,
      color: '#fff',
    },
    groupDate: {
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

export default GrupoScreen;
