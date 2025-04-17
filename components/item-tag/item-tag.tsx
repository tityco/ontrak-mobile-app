import { API_URL } from "@/constants/Constant";
import stySearchTagComp from "@/style_sheet/components/search-tag/search-tag";
import { Ionicons } from "@expo/vector-icons";
import { GLView } from "expo-gl";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View, Text, ActivityIndicator, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { useDispatch } from "react-redux";

interface ItemTagProps {
  item: any;
  onPress: (item: any) => void;
}

export default function ItemTag({ item, onPress }: ItemTagProps) {

  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' }}
      onPress={() => onPress(item)}>

      <Image source={{ uri: `${API_URL}}e/${item.icon}` }}
        style={{ marginRight: 15, width: 40, height: 40 }}
        resizeMode="cover"/>

      <View>
        <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.tagName}</Text>
        <Text style={{ fontSize: 14, color: 'gray' }}> x: {item.x}  y: {item.y} {item.status}</Text>
      </View>
    </TouchableOpacity>
  );
}
