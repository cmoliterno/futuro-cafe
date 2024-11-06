import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import VectoreIcons from './VectoreIcons';
import logo from '../../../assets/Logo-Verde.png';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const AppHeader = () => {
  const navigation = useNavigation();

  const toggleDrawer = () => {
    // Dispara a ação para alternar o drawer
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.headerIcons}>
        <TouchableOpacity>
          <VectoreIcons icon="FontAwesome" name="bell" color="#000" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDrawer}>
          <VectoreIcons icon="FontAwesome" name="bars" color="#000" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#EEDCC8',
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: 'contain',
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
});

export default AppHeader;
