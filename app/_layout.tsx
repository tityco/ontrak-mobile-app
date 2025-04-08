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


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login,setLogin] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const handleLogin = () => {
    if (email === 'admin' && password === 'admin') {
     setLogin(true);
    } else {
      alert('Sai tài khoản hoặc mật khẩu!');
    }
  };
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  const onClick = () => {
    console.log('Button clicked');
  }
  if (!loaded) {
    return null;
  }
  return (
  <Provider store={storeToolkit}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!login ? (
    
          <ScrollView contentContainerStyle = {styles.scrollContainer}>
           
            <ImageBackground
              source={require('@/assets/images/ios-blue-background2.png')}
              style = {styles.background}
              resizeMode="cover"
            >
              <View style={styles.container}>
                <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Đăng Nhập</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </ScrollView>
      ) : (

        <Stack>
        
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      )}

      <StatusBar style="auto" />
    </ThemeProvider>
  </Provider>

  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1} as ViewStyle,
  background: {
    flex: 1
  },
  logo: {
    width: 200,
    height: 200,
    backgroundColor: 'white', // 
    borderRadius: 100, // 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Đổ bóng cho Android
    shadowColor: '#000', // Đổ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom:50
  },
  container: { flex: 1, justifyContent: 'start', alignItems: 'center', paddingTop: 100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '80%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10, backgroundColor: 'white', borderRadius: 10 },
  button: { backgroundColor: '#0A84FF', padding: 10, borderRadius: 10, width: '80%', alignItems: 'center', marginTop: 50 },
  buttonText: { color: 'white', fontSize: 18 },
});
