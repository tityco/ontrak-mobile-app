import { Tabs, Stack } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ParamsNaviga } from '@/constants/ParamsNaviga';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade"
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name={ParamsNaviga.SEARCH_SCREEN.NAME} options={{ headerShown: false }} />
    </Stack>
  );
}
