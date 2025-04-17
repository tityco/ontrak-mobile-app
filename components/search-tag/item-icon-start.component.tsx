import stySearchTagComp from "@/style_sheet/components/search-tag/search-tag";
import { Ionicons } from "@expo/vector-icons";
import { GLView } from "expo-gl";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import { useDispatch } from "react-redux";


export default function ItemIconStartComponent() {

  return (
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
  );
}
