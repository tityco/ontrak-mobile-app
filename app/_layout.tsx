import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, PanResponder, Dimensions, StyleSheet, ActivityIndicator, Text, TextInput, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView, ScrollView, Platform, Button, ViewStyle } from 'react-native';
import { Provider } from 'react-redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import storeToolkit from '@/redux-toolkit/storeToolkit';
import RootScreen from './root';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  
  return (
  <Provider store={storeToolkit}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootScreen/>
      <StatusBar style="auto" />
    </ThemeProvider>
  </Provider>

  );
}
