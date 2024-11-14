import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { Input, Button, Spacing, PasswordInput } from '../../../components';
import { SH } from '../../../utils';
import { RouteName } from '../../../routes';
import { Login } from '../../../styles';
import { useTranslation } from "react-i18next";
import { useTheme } from '@react-navigation/native';
import { register } from '../../../api'; // Importe o método de registro

// Função para validar CPF
const validateCPF = (cpf) => {
  // Remove pontos e traços do CPF
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  return remainder === parseInt(cpf.substring(10, 11));
};

const Register = (props) => {
  const { navigation } = props;
  const { Colors } = useTheme();
  const Logins = useMemo(() => Login(Colors), [Colors]);

  const { t } = useTranslation();
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState(''); // Campo CPF
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);

  const togglePasswordVisibility = () => setPasswordVisibility(!passwordVisibility);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisibility(!confirmPasswordVisibility);

  const handleRegister = async () => {
    try {
      // Verifica se as senhas coincidem ou estão vazias
      if (!password || !confirmPassword || password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem ou estão vazias.');
        return;
      }

      // Validação da senha
      if (password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)) {
        Alert.alert('Erro', 'A senha deve atender aos requisitos mínimos.');
        return;
      }

      // Validação do CPF
      if (!validateCPF(cpf)) {
        Alert.alert('Erro', 'CPF inválido.');
        return;
      }

      // Fazendo a chamada para o método de registro
      const response = await register(email, nomeCompleto, cpf, password);

      // Se o cadastro foi bem-sucedido, navegue para a tela de sucesso
      if (response) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate(RouteName.REGISTRATION_SUCCESSFUL);
      }
    } catch (error) {
      // Exibe um erro genérico se não for o caso de CPF ou email duplicado
      Alert.alert('Erro no Cadastro', error.message || 'Houve um problema ao fazer o cadastro. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Cadastre-se para ver a Estimativa de safra</Text>
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Nome completo"
            onChangeText={setNomeCompleto}
            value={nomeCompleto}
            inputStyle={styles.input}
          />
          <Spacing space={SH(10)} />
          <Input
            placeholder="E-mail"
            onChangeText={setEmail}
            value={email}
            inputStyle={styles.input}
          />
          <Spacing space={SH(10)} />
          <Input
            placeholder="CPF"
            onChangeText={setCpf}
            value={cpf}
            keyboardType="numeric"
            inputStyle={styles.input}
          />
          <Spacing space={SH(10)} />
          <PasswordInput
            name={passwordVisibility ? 'eye-off' : 'eye'}
            placeholder="Senha"
            value={password}
            onPress={togglePasswordVisibility}
            onChangeText={setPassword}
            secureTextEntry={passwordVisibility}
            inputStyle={styles.input}
          />
          <Spacing space={SH(10)} />
          <PasswordInput
            name={confirmPasswordVisibility ? 'eye-off' : 'eye'}
            placeholder="Confirmar senha"
            value={confirmPassword}
            onPress={toggleConfirmPasswordVisibility}
            onChangeText={setConfirmPassword}
            secureTextEntry={confirmPasswordVisibility}
            inputStyle={styles.input}
          />
          <Spacing space={SH(20)} />
          <Text style={styles.passwordRequirements}>
            A senha deve conter ao menos:
          </Text>
          <Text style={styles.passwordRequirementItem}>- 8 caracteres de comprimento</Text>
          <Text style={styles.passwordRequirementItem}>- Uma letra maiúscula</Text>
          <Text style={styles.passwordRequirementItem}>- Uma letra minúscula</Text>
          <Text style={styles.passwordRequirementItem}>- Um número</Text>
        </View>
        <Spacing space={SH(30)} />
        <View style={styles.buttonContainer}>
          <Button
            title="Avançar"
            onPress={handleRegister}
          />
        </View>
        <Spacing space={SH(10)} />
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Já tem uma conta? <Text style={styles.linkText} onPress={() => navigation.navigate(RouteName.LOGIN_SCREEN)}>Acesse aqui!</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#230C02',
    padding: 16,
  },
  scrollView: {
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#3E2723',
  },
  passwordRequirements: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  passwordRequirementItem: {
    color: '#fff',
    marginLeft: 10,
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#34A853',
  },
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
  },
  linkText: {
    color: '#34A853',
    textDecorationLine: 'underline',
  },
});

export default Register;
