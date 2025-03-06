import { StyleSheet, Image, View, SafeAreaView, TextInput, Text, FlatList, TouchableOpacity, Alert } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SearchScreen() {
  const searchInputStart = useRef(null);
  const searchInputDestination = useRef(null);
   const [data, setData] = useState([]);
   const [dataRaw, setDataRaw] = useState([]);
   const [type, setType] = useState(1);
  /* 2. Get the param */
  const x = useLocalSearchParams();

const navigation = useNavigation();
  useEffect(() => {
    if (x.tagInfo) {
      try {
        const parsedData = JSON.parse(x.tagInfo);
        setData(parsedData); // Cập nhật dữ liệu một lần
        setDataRaw(parsedData);
      } catch (error) {
        console.error("Lỗi khi parse JSON:", error);
      }
    }
  }, [x.tagInfo]); // Chỉ chạy khi `x.tagInfo` thay đổi

  const goBack = () => {
    navigation.goBack();
    // router.replace({
    //   pathname: "/",
    //   params: { message: "Hello từ B!" }
    // });
  }
  useEffect(() => {
    if (x.value == 'start') {
      setType(1);
      setTimeout(() => {
        if (searchInputStart.current) {
          searchInputStart.current.focus();
        }
      }, 300); // Delay 300ms để đảm bảo focus không bị mất khi chuyển màn
    } else {
      setType(2);
      setTimeout(() => {
        if (searchInputDestination.current) {
          searchInputDestination.current.focus();
        }
      }, 300); //
    }

  }, [])
  // return {tagID: tag.data.tagID, icon: tag.data.icon, tagName: tag.data.tagName,x: tag.data.x,y: tag.data.y,status:tag.data.status}


  const setSearchQuery = (text)=>{
   if(!text) setData(dataRaw);
   else{
    let dataf = dataRaw.filter(tag => tag.tagName.toLowerCase().includes(text.toLowerCase()))
    setData(dataf);   
   }
  }
  const clicItem = async (item) => {
    if(type == "1"){
      await AsyncStorage.setItem('selectedStart', JSON.stringify( item ));

    }
    else{
      await AsyncStorage.setItem('selectedDestination', JSON.stringify( item ));

    }
    
    navigation.goBack();
  }
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' }}
      onPress={() => clicItem(item)}
    >
      <Image 
        source={{ uri: `https://ontrak.live/${item.icon}` }} 
        style={{ marginRight: 15 , width: 40, height: 40}} 
        resizeMode="cover"
      />

      <View>
        <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.tagName}</Text>
        <Text style={{ fontSize: 14, color: 'gray' }}> x: {item.x}  y: {item.y} {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <View style={styles.itemIcon}>
            <View style={styles.blueCircle}>
              <View style={styles.blueDot} />
            </View>
            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <View style={styles.whiteCircle}>
              <View style={styles.redDot} />
            </View>
          </View>
          <View style={styles.containerSearch}>
            <View
              style={styles.row}
            >
              <TextInput
              readOnly = {type != 1}
                ref={searchInputStart}
                style={styles.title}
                placeholder="Vị trí của bạn"
                onChangeText={(text) => setSearchQuery(text)}
              />
           
            </View>

            <View style={styles.middleContainer}>
              <View style={styles.separator} />
            </View>

            <View
              style={styles.row} >
              <TextInput
                readOnly = {type == 1}
                ref={searchInputDestination}
                style={styles.address}
                onChangeText={(text) => setSearchQuery(text)}
                placeholder="Điểm đến" />
            </View>
          </View>
          <View style={styles.itemIconEnd}>
            <View onTouchStart={goBack}>
              <Ionicons name="close" size={26} color="#000" />

            </View>
            <View style={styles.dotsContainer}>
            </View>
          </View>

        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList style={{  flex: 1 }}
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }} // Giúp danh sách scroll được
          renderItem={renderItem}
        />
    </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1 ,
    height:"100%",
    width: '100%',
    backgroundColor: '#ffffff',
  },
  container: {
    height: 100,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "white", // Bắt buộc để đổ bóng hoạt động
  
    // Đổ bóng cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Đổ bóng xuống dưới
    shadowOpacity: 0.1,
    shadowRadius: 5,
  
    // Đổ bóng cho Android
    elevation: 5,
    zIndex: 1, // Giúp hiển thị rõ ràng trên Android
  },
  infoBox: {
    flexDirection: 'row',
    flex: 1,
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    backgroundColor: "white",



  },
  itemIcon: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,

  },
  /* --- Chấm xanh có viền mờ --- */
  blueCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 122, 255, 0.2)", // Viền xanh mờ
    justifyContent: "center",
    alignItems: "center",
  },
  blueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF", // Màu xanh đậm
    justifyContent: "center",
    alignItems: "center",

  },
  /* --- Khu vực giữa (Ba chấm + Đường phân cách) --- */

  dotsContainer: {
    width: 20,
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,

  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#666",
    marginVertical: 2,
  },

  /* --- Icon vị trí đỏ --- */
  redMarker: {
    width: 20,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "red",
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "red",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    height: 40
  },
  containerSearch: {
    flex: 1,
    marginLeft: 10,
    marginRight: 20,
  },
  middleContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 5
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#DDD",
  },
  title: {
    fontSize: 16,
    color: "#007AFF",

  },
  address: {
    paddingTop: 2,
    fontSize: 16,
    color: "#333",
  },
  itemIconEnd: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,

  },
});

