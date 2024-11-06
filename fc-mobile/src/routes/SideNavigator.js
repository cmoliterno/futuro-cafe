import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import Colors from '../utils/Colors';
import CustomSidebarMenu from '../components/commonComponents/CustomSidebarMenu';
import HomeScreen from '../screens/telas/HomeScreen';
import FazendaScreen from '../screens/telas/FazendaScreen';
import TalhaoScreen from '../screens/telas/TalhaoScreen';
import ProjetoScreen from '../screens/telas/ProjetoScreen';
import GrupoScreen from '../screens/telas/GrupoScreen';
import PhotoCollectionScreen from '../screens/telas/PhotoCollectionScreen';
import PhotoFloweringScreen from '../screens/telas/PhotoFloweringScreen';
import PhotoHarvestScreen from '../screens/telas/PhotoHarvestScreen';
import PhotoPestsScreen from '../screens/telas/PhotoPestsScreen';
import ResultsScreen from '../screens/telas/ResultsScreen';
import TalhaoWizardScreen from '../screens/telas/TalhaoWizardScreen';
import EditProfileScreen from '../screens/EditProfile/EditProfileScreen';

import RouteName from '../routes/RouteName'; // Importar as rotas

const Drawer = createDrawerNavigator();

const SideNavigator = () => {
  const { colorrdata } = useSelector(state => state.commonReducer) || {};
  const [theme, setTheme] = useState(Colors);

  useEffect(() => {
    if (colorrdata) {
      Colors.theme_background = colorrdata;
      setTheme({ ...Colors });
    }
  }, [colorrdata]);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomSidebarMenu {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name={RouteName.HOME_SCREEN} component={HomeScreen} />
      <Drawer.Screen name={RouteName.EDIT_PROFILE_SCREEN} component={EditProfileScreen} />
      <Drawer.Screen name={RouteName.FAZENDA_SCREEN} component={FazendaScreen} />
      <Drawer.Screen name={RouteName.TALHAO_SCREEN} component={TalhaoScreen} />
      <Drawer.Screen name={RouteName.PROJETO_SCREEN} component={ProjetoScreen} />
      <Drawer.Screen name={RouteName.GRUPO_SCREEN} component={GrupoScreen} />
      <Drawer.Screen name={RouteName.PHOTO_COLLECTION_SCREEN} component={PhotoCollectionScreen} />
      <Drawer.Screen name={RouteName.PHOTO_FLOWERING_SCREEN} component={PhotoFloweringScreen} />
      <Drawer.Screen name={RouteName.PHOTO_HARVEST_SCREEN} component={PhotoHarvestScreen} />
      <Drawer.Screen name={RouteName.PHOTO_PESTS_SCREEN} component={PhotoPestsScreen} />
      <Drawer.Screen name={RouteName.RESULTS_SCREEN} component={ResultsScreen} />
      <Drawer.Screen name={RouteName.TALHAO_WIZARD_SCREEN} component={TalhaoWizardScreen} />
    </Drawer.Navigator>
  );
};

export default SideNavigator;
