import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import ConfirmationAlert from '../commonComponents/ConfirmationAlert';
import VectoreIcons from '../commonComponents/VectoreIcons';
import Colors from '../../utils/Colors';
import { useTranslation } from 'react-i18next';
import { SF } from '../../utils/dimensions';
import RouteName from '../../routes/RouteName';
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomSidebarMenu = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const alertdata = {
    logout: t('Are_You_Sure_logout'),
  };

  const handleLogout = async () => {
    try {
      // Remove o accessToken do AsyncStorage
      await AsyncStorage.removeItem('accessToken');
      navigation.reset({
        index: 0,
        routes: [{ name: RouteName.LOGIN_SCREEN }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleNavigation = (route) => {
    navigation.navigate(route);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.customSidebarMenu}>
        <TouchableOpacity
          style={styles.flexRowSet}
          onPress={() => handleNavigation(RouteName.HOME_SCREEN)}>
          <VectoreIcons
            icon="FontAwesome5"
            size={SF(19)}
            name="home"
            color={Colors.green}
          />
          <Text style={styles.homeTextStyle}>{t('Home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.flexRowSet}
          onPress={() => handleNavigation(RouteName.EDIT_PROFILE_SCREEN)}>
          <VectoreIcons
            icon="FontAwesome5"
            size={SF(19)}
            name="user"
            color={Colors.brown}
          />
          <Text style={styles.homeTextStyle}>{t('Minha Conta')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.flexRowSet}
          onPress={() => handleNavigation(RouteName.FAZENDA_SCREEN)}>
          <VectoreIcons
            icon="FontAwesome5"
            size={SF(19)}
            name="crosshairs"
            color={Colors.brown}
          />
          <Text style={styles.homeTextStyle}>{t('Fazendas')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.flexRowSet}
          onPress={() => handleNavigation(RouteName.TALHAO_SCREEN)}>
          <VectoreIcons
            icon="FontAwesome5"
            size={SF(19)}
            name="leaf"
            color={Colors.brown}
          />
          <Text style={styles.homeTextStyle}>{t('Talhões')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.flexRowSet}
          onPress={() => handleNavigation(RouteName.PROJETO_SCREEN)}>
          <VectoreIcons
            icon="FontAwesome5"
            size={SF(19)}
            name="seedling"
            color={Colors.brown}
          />
          <Text style={styles.homeTextStyle}>{t('Projetos')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.flexRowSet}
          onPress={() => handleNavigation(RouteName.GRUPO_SCREEN)}>
          <VectoreIcons
            icon="FontAwesome5"
            size={SF(19)}
            name="users"
            color={Colors.brown}
          />
          <Text style={styles.homeTextStyle}>{t('Grupos')}</Text>
        </TouchableOpacity>
        <View style={styles.settingAndLogout}>
          <TouchableOpacity
            style={styles.flexRowSet}
            onPress={() => {
              setAlertVisible(true);
              setAlertMessage(alertdata.logout);
            }}>
            <VectoreIcons
              icon="FontAwesome5"
              name="sign-out-alt"
              color={Colors.brown}
              size={SF(23)}
            />
            <Text style={styles.homeTextStyle}>{t('Sair')}</Text>
          </TouchableOpacity>
        </View>
        <ConfirmationAlert
          message={alertMessage}
          modalVisible={alertVisible}
          setModalVisible={setAlertVisible}
          onPressCancel={() => setAlertVisible(!alertVisible)}
          onPress={() => {
            setAlertVisible(!alertVisible);
            handleLogout();
          }}
          cancelButtonText={t('Cancel_Button')}
          buttonText={t('Ok')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDEBD0',
  },
  customSidebarMenu: {
    flex: 1,
    backgroundColor: '#FDEBD0',
  },
  flexRowSet: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  homeTextStyle: {
    fontSize: 18,
    marginLeft: 10,
    color: '#230C02',
  },
  settingAndLogout: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light_gray_text_color,
  },
});

export default CustomSidebarMenu;
