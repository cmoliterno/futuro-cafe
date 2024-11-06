import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import VectoreIcons from './VectoreIcons';
import RouteName from '../../routes/RouteName';

const BottomMenu = () => {
  const navigation = useNavigation();
  const state = useNavigationState((state) => state);

  // Determine the active route
  const activeRouteName = state.routes[state.index].name;

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate(RouteName.HOME_SCREEN)}>
        <VectoreIcons
          icon="FontAwesome5"
          name="home"
          color={activeRouteName === RouteName.HOME_SCREEN ? "#047502" : "#230C02"}
          size={24}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(RouteName.EDIT_PROFILE_SCREEN)}>
        <VectoreIcons
          icon="FontAwesome5"
          name="user"
          color={activeRouteName === RouteName.EDIT_PROFILE_SCREEN ? "#047502" : "#230C02"}
          size={24}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(RouteName.FAZENDA_SCREEN)}>
        <VectoreIcons
          icon="FontAwesome5"
          name="crosshairs"
          color={activeRouteName === RouteName.FAZENDA_SCREEN ? "#047502" : "#230C02"}
          size={24}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(RouteName.TALHAO_SCREEN)}>
        <VectoreIcons
          icon="FontAwesome5"
          name="expand-arrows-alt"
          color={activeRouteName === RouteName.TALHAO_SCREEN ? "#047502" : "#230C02"}
          size={24}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#EEDCC8',
  },
});

export default BottomMenu;
