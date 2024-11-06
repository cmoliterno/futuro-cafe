import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { SideNavigator } from "./src/routes";

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <SideNavigator />
    </NavigationContainer>
  );
}
