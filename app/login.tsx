import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import React, { useState } from 'react';
import stylesRoot from '@/style_sheet/app/root';
import { useDispatch } from 'react-redux';
import userSlice from '@/redux-toolkit/slice/user-slice';
import { MESSAGE } from '@/constants/Message';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (email === 'admin' && password === 'admin') {
      dispatch(userSlice.actions.setIsLoging(true));
    } else {
      alert(MESSAGE.INCORRECT_USER);
    }
  };

  return (
    <ScrollView contentContainerStyle={stylesRoot.scrollContainer}>
      <ImageBackground
        source={require('@/assets/images/ios-blue-background2.png')}
        style={stylesRoot.background}
        resizeMode="cover">
        <View style={stylesRoot.container}>
          <Image source={require('@/assets/images/icon.png')} style={stylesRoot.logo} />
          <TextInput
            style={stylesRoot.input}
            placeholder={MESSAGE.EMAIL}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={stylesRoot.input}
            placeholder={MESSAGE.PASSWORD}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={stylesRoot.button} onPress={handleLogin}>
            <Text style={stylesRoot.buttonText}>{MESSAGE.LOG_IN}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}
