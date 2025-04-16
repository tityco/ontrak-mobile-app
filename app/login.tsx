import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import React, { useState } from 'react';
import stylesRoot from '@/style_sheet/app/root';
import { useDispatch } from 'react-redux';
import userSlice from '@/redux-toolkit/slice/user-slice';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (email === 'admin' && password === 'admin') {
      dispatch(userSlice.actions.setIsLoging(true));
    } else {
      alert('Sai tài khoản hoặc mật khẩu!');
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={stylesRoot.input}
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={stylesRoot.button} onPress={handleLogin}>
            <Text style={stylesRoot.buttonText}>Đăng Nhập</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}
