import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile, updateUserProfile, updateUserPassword } from '../../api/index';
import AppHeader from '../../components/commonComponents/AppHeader';
import BottomMenu from '../../components/commonComponents/BottomMenu';
import Buttons from '../../components/commonComponents/Button';
import { SF, SH, Colors, Fonts } from '../../utils';
import { RouteName } from '../../routes';
import { VectorIcon } from '../../components';
import { TextInputMask } from 'react-native-masked-text';

const EditProfileScreen = () => {
  const [profile, setProfile] = useState({
    nomeCompleto: '',
    email: '',
    celular: '',
  });
  const [message, setMessage] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showProfile, setShowProfile] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const scheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfile(response.result);
      } catch (e) {
        console.error('Erro ao obter perfil do usuário:', e);
        if (e.response?.data?.messages[0]?.message === 'Acesso não autorizado') {
          await AsyncStorage.removeItem('accessToken');
          navigation.navigate(RouteName.LOGIN_SCREEN);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!profile.celular || profile.celular.trim() === '') {
      setMessage('O campo celular é obrigatório.');
      return;
    }
    try {
      await updateUserProfile(profile);
      setMessage('Perfil atualizado com sucesso.');
    } catch (e) {
      const errorMsg = e.response?.data?.messages[0]?.message || 'Erro ao atualizar o perfil.';
      setMessage(errorMsg);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }
    try {
      await updateUserPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Senha atualizada com sucesso.');
    } catch (e) {
      setMessage('Erro ao atualizar a senha.');
    }
  };

  const dynamicStyles = styles(scheme);

  return (
    <View style={dynamicStyles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={dynamicStyles.content}>
        <TouchableOpacity onPress={() => setShowProfile(!showProfile)} style={dynamicStyles.dropdownHeader}>
          <Text style={dynamicStyles.dropdownHeaderText}>Dados Cadastrais</Text>
          <VectorIcon name="chevron-down" size={SF(25)} color="#fff" icon="Entypo" />
        </TouchableOpacity>
        {showProfile && (
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.label}>Nome</Text>
            <TextInput
              style={dynamicStyles.input}
              value={profile.nomeCompleto}
              onChangeText={(text) => setProfile({ ...profile, nomeCompleto: text })}
            />
            <Text style={dynamicStyles.label}>Email</Text>
            <TextInput
              style={dynamicStyles.input}
              value={profile.email}
              editable={false}
            />
            <Text style={dynamicStyles.label}>Telefone</Text>
            <TextInputMask
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
              style={dynamicStyles.input}
              value={profile.celular || ''}
              onChangeText={(text) => setProfile({ ...profile, celular: text })}
            />
            <Buttons
              title="Atualizar Perfil"
              onPress={handleUpdateProfile}
              buttonStyle={dynamicStyles.button}
              buttonTextStyle={dynamicStyles.buttonText}
            />
          </View>
        )}
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={dynamicStyles.dropdownHeader}>
          <Text style={dynamicStyles.dropdownHeaderText}>Alterar Senha</Text>
          <VectorIcon name="chevron-down" size={SF(25)} color="#fff" icon="Entypo" />
        </TouchableOpacity>
        {showPassword && (
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.label}>Nova Senha</Text>
            <TextInput
              style={dynamicStyles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Text style={dynamicStyles.label}>Confirmar Senha</Text>
            <TextInput
              style={dynamicStyles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Buttons
              title="Atualizar Senha"
              onPress={handleUpdatePassword}
              buttonStyle={dynamicStyles.button}
              buttonTextStyle={dynamicStyles.buttonText}
            />
          </View>
        )}
        {message && <Text style={[dynamicStyles.message, message.includes('sucesso') ? dynamicStyles.successMessage : dynamicStyles.errorMessage]}>{message}</Text>}
      </ScrollView>
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
    dropdownHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#333',
      borderRadius: 5,
      marginBottom: 10,
    },
    dropdownHeaderText: {
      color: '#fff',
      fontFamily: 'Poppins-Medium',
      fontSize: 18,
    },
    section: {
      backgroundColor: '#333',
      padding: 15,
      borderRadius: 5,
      marginBottom: 15,
    },
    label: {
      fontSize: 18,
      color: '#fff',
      fontFamily: 'Poppins-Medium',
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
      backgroundColor: scheme === 'dark' ? '#555' : '#fff',
      color: scheme === 'dark' ? '#fff' : '#000',
      fontFamily: 'Poppins-Medium',
    },
    message: {
      textAlign: 'center',
      marginBottom: 12,
    },
    successMessage: {
      color: 'green',
    },
    errorMessage: {
      color: 'red',
    },
    button: {
      backgroundColor: '#4CAF50',
      borderRadius: 20,
      width: '60%',
      alignSelf: 'center',
      paddingVertical: 10,
      marginBottom: 10,
    },
    buttonText: {
      color: '#fff',
      fontFamily: 'Poppins-Medium',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
  });

export default EditProfileScreen;
