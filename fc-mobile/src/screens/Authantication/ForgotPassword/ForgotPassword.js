import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  useColorScheme,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from '../../../api/index';
import logo from '../../../../assets/logo.png';
import { SH, SF } from '../../../utils';
import images from "../../../index";
import { Spacing } from "../../../components"; // Importar utilitários de dimensionamento

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const scheme = useColorScheme(); // Detecta o tema do dispositivo

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(email);
      Alert.alert(
        'Sucesso',
        'Email de redefinição de senha enviado com sucesso. Verifique sua caixa de entrada.',
      );
    } catch (e) {
      Alert.alert('Erro', 'Erro ao enviar email de redefinição. Tente novamente.');
    }
  };

  const dynamicStyles = styles(scheme);

  return (
    <View style={dynamicStyles.container}>
      <Image source={images.Login_Logo} style={dynamicStyles.logo} />
      <Spacing space={SH(30)} />
      <Text style={dynamicStyles.title}>Redefinição de Senha</Text>
      <TextInput
        style={dynamicStyles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={scheme === 'dark' ? '#ccc' : '#999'}
      />
      <TouchableOpacity
        style={dynamicStyles.button}
        onPress={handlePasswordReset}
      >
        <Text style={dynamicStyles.buttonText}>Enviar E-mail de Redefinição</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[dynamicStyles.button, dynamicStyles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={dynamicStyles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (scheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: scheme === 'dark' ? '#333' : '#E2CAAC',
    },
    logoImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
    title: {
      fontSize: SF(22),
      fontWeight: 'bold',
      marginBottom: SH(20),
      textAlign: 'center',
      color: scheme === 'dark' ? '#fff' : '#333',
    },
    input: {
      height: SH(45),
      width: '90%',
      borderColor: scheme === 'dark' ? '#777' : 'gray',
      borderWidth: 1,
      marginBottom: SH(15),
      paddingHorizontal: 8,
      backgroundColor: scheme === 'dark' ? '#555' : '#fff',
      color: scheme === 'dark' ? '#fff' : '#000',
      borderRadius: 8,
    },
    button: {
      backgroundColor: '#34A853',
      paddingVertical: SH(12),
      paddingHorizontal: SF(25),
      borderRadius: 25,
      marginBottom: SH(10),
      width: '90%',
      alignItems: 'center',
    },
    backButton: {
      backgroundColor: '#444',
    },
    buttonText: {
      color: '#FFF',
      fontSize: SF(16),
      fontWeight: 'bold',
    },
  });

export default ForgotPasswordScreen;
