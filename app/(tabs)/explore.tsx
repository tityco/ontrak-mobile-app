import { StyleSheet, Image, Platform, View,Text, TextInput, Switch, Button, SafeAreaView} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { addTodoList, changeUserName } from '@/redux/actions';
import userSlice  from '@/redux-toolkit/userReducerSliceToolkit';
import { userNameSelector } from '@/redux/selector';
export default function TabTwoScreen() {

  const navigation = useNavigation();

  const [username, setUsername] = useState('Người dùng');
  const [email, setEmail] = useState('user@example.com');
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();

  const userNamestore = useSelector(userNameSelector);
  console.log('Tên người dùng từ Redux:', userNamestore);
  const saveSettings = () => {
    dispatch(userSlice.actions.changeUserName(username));
    console.log('Đã lưu:', { username, email, darkMode });
  
  };

  return (
    <SafeAreaView style={styles.container}>
      
    <Text style={styles.title}>Cài đặt người dùng</Text>
    <Text>{userNamestore}</Text>
    <View style={styles.inputContainer}>
      <Text>Tên:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
    </View>

    <View style={styles.inputContainer}>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
    </View>

    <View style={styles.switchContainer}>
      <Text>Chế độ tối:</Text>
      <Switch
        value={darkMode}
        onValueChange={setDarkMode}
      />
    </View>

    <Button title="Lưu cài đặt" onPress={saveSettings} />

    <Button title="Quay lại" onPress={() => navigation.goBack()} color="gray" />
  </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
