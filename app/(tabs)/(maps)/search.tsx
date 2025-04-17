import { StyleSheet, Image, View, SafeAreaView, TextInput, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Constant';
import ItemTag from '@/components/item-tag/item-tag';
import { ParamsNaviga } from '@/constants/ParamsNaviga';
import { useDispatch, useSelector } from 'react-redux';
import findingSlice from '@/redux-toolkit/slice/finding-slice';
import { listTagSearchFilter, selectedDestinationSelector, selectedStartSelector, } from '@/redux-toolkit/selector/selector-toolkit';
import { MESSAGE } from '@/constants/Message';
import searchSlice from '@/redux-toolkit/slice/search-slice';



export default function SearchScreen() {

  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  
  const searchInputStart = useRef<any>(null);
  const searchInputDestination = useRef<any>(null);
  const [typeSearch, setTypeSearch] = useState<any>('');

  const data = useSelector(listTagSearchFilter);

  const tagStart = useSelector(selectedStartSelector);
  const tagDestination = useSelector(selectedDestinationSelector);

  const [searchStart, setSearchStart] = useState(tagStart?.tagName ?? "")
  const [searchDestination, setSearchDestination] = useState(tagDestination?.tagName??"")

  const goBack = () => {
    navigation.goBack();
  }
  
  useEffect(() => {
    dispatch(searchSlice.actions.setSearchTag(''));
    setTypeSearch(params.value);
    if (params.value == ParamsNaviga.SEARCH_SCREEN.START) {
      setTimeout(() => {
        if (searchInputStart.current) {
          searchInputStart.current.focus();
        }
      }, 300); 
    } else {
      setTimeout(() => {
        if (searchInputDestination.current) {
          searchInputDestination.current.focus();
        }
      }, 300); 
    }
  }, [])


  const setSearchQuery = (text:any, searchType:any)=>{
    if(searchType == ParamsNaviga.SEARCH_SCREEN.START) setSearchStart(text);
    else  setSearchDestination(text);
    dispatch(searchSlice.actions.setSearchTag(text));
  }

  const clicItem = async (item:any) => {
    if(typeSearch == ParamsNaviga.SEARCH_SCREEN.START){
      dispatch(findingSlice.actions.changeStart(item));
    }
    else{
      dispatch(findingSlice.actions.chageDestination(item));
    }
    dispatch(searchSlice.actions.setSearchTag(''));
    navigation.goBack();
  }
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
                readOnly = {typeSearch != ParamsNaviga.SEARCH_SCREEN.START}
                ref={searchInputStart}
                style={styles.title}
                value={searchStart}
                placeholder={MESSAGE.YOUR_LOCATION}
                onChangeText={(text) => setSearchQuery(text, ParamsNaviga.SEARCH_SCREEN.START)}
              />
           
            </View>

            <View style={styles.middleContainer}>
              <View style={styles.separator} />
            </View>

            <View
              style={styles.row} >
              <TextInput
                readOnly = {typeSearch != ParamsNaviga.SEARCH_SCREEN.DESTINATION}
                ref={searchInputDestination}
                style={styles.address}
                value={searchDestination}
                onChangeText={(text) => setSearchQuery(text, ParamsNaviga.SEARCH_SCREEN.DESTINATION )}
                placeholder={MESSAGE.DESTINATION} />
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
          keyExtractor={(item:any) => item.id}
          contentContainerStyle={{ flexGrow: 1 }} 
          renderItem={({ item }) => (
            <ItemTag item={item} onPress={(selectedItem) => clicItem(selectedItem)} />
          )}
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

