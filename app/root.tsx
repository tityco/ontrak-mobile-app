import { Link, Stack } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Image, TextInput, View, TouchableOpacity, Text, ViewStyle, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { isLoadingAllSelector, isLoginSelector } from '@/redux-toolkit/selector/selector-toolkit';
import LoginScreen from './login';
import styRoot from '@/style_sheet/app/root';

export default function RootScreen() {
  const isLoading = useSelector(isLoadingAllSelector);
  const isLogin = useSelector(isLoginSelector);

  return (
    <>
      <View style={{ flex: 1 }}>
        {isLoading && (
          <View style={styRoot.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        )}

        {!isLogin ? (
          <LoginScreen />
        ) : (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        )}
      </View>

    </>
  );
}
