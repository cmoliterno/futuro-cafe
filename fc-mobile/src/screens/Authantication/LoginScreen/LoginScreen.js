import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Button, Input, Spacing, PasswordInput } from '../../../components';
import { RouteName } from '../../../routes';
import { SH, SF } from '../../../utils';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import images from '../../../index';
import { login, getFarms, getPlots } from '../../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = (props) => {
  const { Colors } = useTheme();
  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [TextInputPassword, setTextInputPassword] = useState('');
  const { t } = useTranslation();

  const onChangeText = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const OnRegisterPress = () => {
    navigation.navigate(RouteName.REGISTER_SCREEN);
  };

  const handleLogin = async () => {
    try {
      const response = await login(email, TextInputPassword);
      console.log('Resposta de login:', response);
      if (response && response.result && response.result.accessToken) {
        const accessToken = response.result.accessToken;
        await AsyncStorage.setItem('accessToken', accessToken);
        Alert.alert('Login bem-sucedido');

        // Verifique se há fazendas cadastradas
        const farmsResponse = await getFarms(accessToken, 1, 25, '');
        if (farmsResponse.result.length === 0) {
          navigation.navigate(RouteName.FAZENDA_SCREEN); // Redireciona para tela de cadastro de fazenda
        } else {
          // Verifique se há talhões cadastrados
          const plotsResponse = await getPlots(accessToken, 1, 25, '');
          if (plotsResponse.result.length === 0) {
            navigation.navigate(RouteName.TALHAO_SCREEN); // Redireciona para tela de cadastro de talhão
          } else {
            navigation.navigate(RouteName.HOME_SCREEN); // Redireciona para a tela principal
          }
        }
      } else {
        throw new Error('A resposta do login está malformada.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro no Login', error.response ? error.response.data.messages[0].message : error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          <View style={styles.centerImage}>
            <Image source={images.Login_Logo} style={styles.logoImage} />
          </View>
          <Spacing space={SH(20)} />
          <Text style={styles.welcomeText}>{t("Bem-vindo(a) de volta!")}</Text>
          <Spacing space={SH(30)} />
          <View style={styles.inputContainer}>
            <Input
              placeholder={t("E-mail")}
              onChangeText={(value) => setEmail(value)}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={Colors.gray_text_color}
              inputStyle={styles.inputStyle}
            />
          </View>
          <Spacing space={SH(10)} />
          <View style={styles.inputContainer}>
            <PasswordInput
              name={passwordVisibility ? 'eye-off' : 'eye'}
              placeholder={t("Senha")}
              value={TextInputPassword}
              onPress={() => onChangeText()}
              onChangeText={(text) => setTextInputPassword(text)}
              secureTextEntry={passwordVisibility}
              inputStyle={styles.inputStyle}
            />
          </View>

          <Spacing space={SH(19)} />
          <Button
            title={t("Confirmar")}
            onPress={handleLogin}
            buttonStyle={styles.loginButton}
            buttonTextStyle={styles.loginButtonText}
          />
          <Spacing space={SH(20)} />
          <View style={styles.forgotContainer}>
            <TouchableOpacity onPress={() => navigation.navigate(RouteName.FORGOT_PASSWORD)}>
              <Text style={styles.forgotPasswordText}>{t("Esqueci minha senha!")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              {t("Ainda não tem uma conta?")}{" "}
              <Text style={styles.registerLinkText} onPress={OnRegisterPress}>
                {t("Cadastre-se")}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#230C02',
  },
  topImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
  },
  scrollViewContent: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginVertical: 10,
  },
  inputStyle: {
    color: '#FFFFFF',
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
    paddingBottom: 5,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#34A853',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FFF',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#FFF',
    textAlign: 'center',
  },
  registerLinkText: {
    color: '#34A853',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
