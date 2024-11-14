import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { Colors } from '../utils';
import { RouteName, SideNavigator } from '../routes';
import {
  LoginScreen,
  RegisterScreen,
  OtpVerifyScreen,
  RegistrationSuccessful,
  SwiperScreen,
  TranslationScreen,
  ForgotPassword, EditProfileScreen,
} from "../screens";
import PhotoCollectionScreen from '../screens/telas/PhotoCollectionScreen';
import PhotoHarvestScreen from '../screens/telas/PhotoHarvestScreen';
import PhotoFloweringScreen from '../screens/telas/PhotoFloweringScreen';
import PhotoPestsScreen from '../screens/telas/PhotoPestsScreen';
import ResultsScreen from '../screens/telas/ResultsScreen';
import FazendaScreen from '../screens/telas/FazendaScreen';
import GrupoScreen from '../screens/telas/GrupoScreen';
import ProjetoScreen from '../screens/telas/ProjetoScreen';
import TalhaoScreen from '../screens/telas/TalhaoScreen';
import TalhaoWizardScreen from '../screens/telas/TalhaoWizardScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { colorrdata } = useSelector(state => state.commonReducer) || {};
  const MyTheme = {
    ...DefaultTheme,
    Colors: Colors,
  };
  const [colorValue, setColorValue] = useState(MyTheme);

  useEffect(() => {
    if (Colors.length !== 0 && colorrdata !== "") {
      Colors.theme_background = colorrdata;
      const MyThemeNew = {
        ...DefaultTheme,
        Colors: Colors,
      };
      setColorValue(MyThemeNew);
    }
  }, [colorrdata, Colors]);

  return (
    <NavigationContainer theme={colorValue}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={RouteName.LOGIN_SCREEN} component={LoginScreen} />
        <Stack.Screen name={RouteName.HOME_SCREEN} component={SideNavigator} />
        <Stack.Screen name={RouteName.EDIT_PROFILE_SCREEN} component={EditProfileScreen} />
        <Stack.Screen name={RouteName.REGISTER_SCREEN} component={RegisterScreen} />
        <Stack.Screen name={RouteName.REGISTRATION_SUCCESSFUL } component={RegistrationSuccessful} />
        <Stack.Screen name={RouteName.SWIPER_SCREEN} component={SwiperScreen} />
        <Stack.Screen name={RouteName.FORGOT_PASSWORD} component={ForgotPassword} />
        <Stack.Screen name={RouteName.PHOTO_COLLECTION_SCREEN} component={PhotoCollectionScreen} />
        <Stack.Screen name={RouteName.PHOTO_HARVEST_SCREEN} component={PhotoHarvestScreen} />
        <Stack.Screen name={RouteName.PHOTO_FLOWERING_SCREEN} component={PhotoFloweringScreen} />
        <Stack.Screen name={RouteName.PHOTO_PESTS_SCREEN} component={PhotoPestsScreen} />
        <Stack.Screen name={RouteName.RESULTS_SCREEN} component={ResultsScreen} />
        <Stack.Screen name={RouteName.FAZENDA_SCREEN} component={FazendaScreen} />
        <Stack.Screen name={RouteName.GRUPO_SCREEN} component={GrupoScreen} />
        <Stack.Screen name={RouteName.PROJETO_SCREEN} component={ProjetoScreen} />
        <Stack.Screen name={RouteName.TALHAO_SCREEN} component={TalhaoScreen} />
        <Stack.Screen name={RouteName.TALHAO_WIZARD_SCREEN} component={TalhaoWizardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
