import { StyleSheet, Image, View,SafeAreaView , TextInput, Text} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (

      <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.searchContainerBar}>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={styles.icon}
        />
        <TextInput
            editable={false}
          style={styles.searchInput}
          placeholder="Tìm kiếm địa điểm"
        //   value={searchQuery}
        //   onChangeText={setSearchQuery}
        //   onTouchStart={moveScreenSearch}
        />
      </View>
      <View style={styles.searchContainer}>
        <Text>fasdfasdfs</Text>
      </View>
     
      </SafeAreaView>


  );
}

const styles = StyleSheet.create({
    safeAreaView:{
      flex: 1,
      backgroundColor: '#f0f0f0',
      width: '100%',
    },
    searchContainer: {
        paddingTop:50,
        flex:1,
      alignItems: 'center',

    },
    searchInput: {
      height: 40,
      fontSize: 16,
    },
    searchContainerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 5, // Đổ bóng cho Android
        shadowColor: '#000', // Đổ bóng cho iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    icon: {
      width: 40,
      height: 40,
      marginHorizontal: 5,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    }
  });
  