import stySearchTagComp from "@/style_sheet/components/search-tag/search-tag";
import { Ionicons } from "@expo/vector-icons";
import { GLView } from "expo-gl";
import { useNavigation } from "expo-router";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import { useDispatch } from "react-redux";


export default function SearchTagComponent() {
  const navigation = useNavigation();

  
  const moveScreenSearch = (value: any) => {
    navigation.navigate("search", { value: value })
  }

  return (
    <SafeAreaView style={stySearchTagComp.safeAreaView}>
      <View style={stySearchTagComp.container}>
        <View style={stySearchTagComp.infoBox}>
          <View style={stySearchTagComp.itemIconStart}>
            <View style={stySearchTagComp.blueCircle}>
              <View style={stySearchTagComp.blueDot} />
            </View>
            <View style={stySearchTagComp.dotsContainer}>
              <View style={stySearchTagComp.dot} />
              <View style={stySearchTagComp.dot} />
              <View style={stySearchTagComp.dot} />
            </View>
            <View style={stySearchTagComp.whiteCircle}>
              <View style={stySearchTagComp.redDot} />
            </View>
          </View>
          <View style={stySearchTagComp.containerSearch}>
            <View
              style={stySearchTagComp.row}
              onTouchStart={(event) => moveScreenSearch("start")}>
              <Text style={stySearchTagComp.title}>Vị trí của bạn</Text>
            </View>

            <View style={stySearchTagComp.middleContainer}>
              <View style={stySearchTagComp.separator} />
            </View>
            <View
              style={stySearchTagComp.row}
              onTouchStart={(event) => moveScreenSearch("destination")}>
              <Text style={stySearchTagComp.address}>Điểm đến</Text>
            </View>
          </View>
          <View style={stySearchTagComp.itemIconEnd}>
            <View>
              {finding ? (
                <Ionicons name="close" size={26} color="#000" onPress={closeFinding} />
              ) : (
                <View></View>
              )}
            </View>
            <View style={stySearchTagComp.dotsContainer}>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
