import stySearchTagComp from "@/style_sheet/components/search-tag/search-tag";
import { Ionicons } from "@expo/vector-icons";
import { GLView } from "expo-gl";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ItemIconStartComponent from "./item-icon-start.component";
import { isFindingSelector, selectedDestinationSelector, selectedStartSelector } from "@/redux-toolkit/selector/selector-toolkit";
import { ParamsNaviga } from "@/constants/ParamsNaviga";
import findingSlice from "@/redux-toolkit/slice/finding-slice";
import { MESSAGE } from "@/constants/Message";



export default function SearchTagComponent() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const finding = useSelector(isFindingSelector);
  const tagStart = useSelector(selectedStartSelector);
  const tagDestination = useSelector(selectedDestinationSelector);
  
  const moveScreenSearch = (value: any) => {
    navigation.navigate(ParamsNaviga.SEARCH_SCREEN.NAME, { value: value })
  }

  const closeFinding = ()=> { 
     dispatch(findingSlice.actions.changeStart(null));
     dispatch(findingSlice.actions.chageDestination(null));
  }

  return (
    <SafeAreaView style={stySearchTagComp.safeAreaView}>
      <View style={stySearchTagComp.container}>
        <View style={stySearchTagComp.infoBox}>
          <ItemIconStartComponent/>
          <View style={stySearchTagComp.containerSearch}>
            <View
              style={stySearchTagComp.row}
              onTouchStart={(event) => moveScreenSearch(ParamsNaviga.SEARCH_SCREEN.START)}>
              <Text style={stySearchTagComp.title}>{tagStart?.tagName ?? MESSAGE.YOUR_LOCATION}</Text>
            </View>

            <View style={stySearchTagComp.middleContainer}>
              <View style={stySearchTagComp.separator} />
            </View>
            <View
              style={stySearchTagComp.row}
              onTouchStart={(event) => moveScreenSearch(ParamsNaviga.SEARCH_SCREEN.DESTINATION)}>
              <Text style={stySearchTagComp.address}>{tagDestination?.tagName ?? MESSAGE.DESTINATION}</Text>
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
