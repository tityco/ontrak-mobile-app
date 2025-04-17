

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as FileSystem from 'expo-file-system';
import React, { useRef, useEffect, useState, useCallback, } from 'react';
import { View, PanResponder, Dimensions, StyleSheet, ActivityIndicator, Text, TextInput, Image, SafeAreaView, Switch } from 'react-native';
import { Renderer, TextureLoader } from 'expo-three';
import { THREE } from 'expo-three';
import { GLView } from 'expo-gl';
import * as SplashScreen from 'expo-splash-screen';
import axios from "axios";
import { Asset } from 'expo-asset';
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import { MAP_ID, USER_ID, MOVE_SPEED } from '@/constants/Constant';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Group, Tween, Easing, update } from '@tweenjs/tween.js';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightSpeedInLeft } from 'react-native-reanimated';
import SignalRService from '@/services/signalr.service'

import { loadTextureFromURL, updatePositonTag } from '@/_helper/app/tabs/maps/index-heper';
import threeMapService from '@/services/three-map.service';
import { useDispatch, useSelector } from 'react-redux';
import { isLoadingMapScreenSelector, mapInfoSelector, selectedDestinationSelector, selectedStartSelector, tagsInfoSelector } from '@/redux-toolkit/selector/selector-toolkit';
import { useGetMapInfoQuery } from '@/redux-toolkit/api/mapInfo-api';
import findingSlice from '@/redux-toolkit/slice/finding-slice';
import mapInfoSlice from '@/redux-toolkit/slice/mapInfo-slice';
import { useGetListTagInfoQuery } from '@/redux-toolkit/api/tagInfio-api';
import listTagsInfoSlice from '@/redux-toolkit/slice/lsittagsInfo-slice';
import MapViewComponent from '@/components/map-view/map-view.component';
import loadingSlice from '@/redux-toolkit/slice/loading-slice';
import styMap from '@/style_sheet/app/tabs/map';
import SearchTagComponent from '@/components/search-tag/search-tag.component';
import { MESSAGE } from '@/constants/Message';

export default function MapScreen() {

  const dispatch = useDispatch();
  const { data: mapInfo, error: mapError, isLoading: isLoadingMap } = useGetMapInfoQuery(MAP_ID);
  const { data: listTagInfo, error: tagError, isLoading: isLoadingTag} = useGetListTagInfoQuery(MAP_ID);
  const isLoading = useSelector(isLoadingMapScreenSelector);

  const [serverTime, setServerTime] = useState(`${MESSAGE.CONNECTING}...`)


  useEffect(() => {
    dispatch(loadingSlice.actions.setLoadingMapScreen(MESSAGE.LOAIND_MAP));
  },[]);

  useEffect(() => {
    if(!isLoadingMap && !isLoadingTag) {
      dispatch(loadingSlice.actions.removeLoadingMapScreen(MESSAGE.LOAIND_MAP));
      initData();
    }
  },[isLoadingMap, isLoadingTag]);


  const onReceivePosition = (data: any) => {
    dispatch(listTagsInfoSlice.actions.updateTag(data));
  }

  const onReceivePing = (data:any)=>{
   setServerTime(data)
  }

  const configSignalR = () => {
    SignalRService.onDisconnectCallback = (error: any) => {
      setServerTime(`${MESSAGE.CONNECTING}...`)
    }
    SignalRService.startConnection();
    SignalRService.on("SendPing", onReceivePing);
    SignalRService.on("SendPosition", onReceivePosition);
    SignalRService.on("Connected", (msg: any) => {});
    SignalRService.on("sendbasestation", (msg: any) => {})
  }

  const initData = () => {
    dispatch(mapInfoSlice.actions.changeMap(mapInfo));
    dispatch(listTagsInfoSlice.actions.changeTags(listTagInfo));
    configSignalR();
  }


  return (
    <View style={{ flex: 1 }} >
      {isLoading && (
        <View style={styMap.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
      <MapViewComponent />
      <SearchTagComponent/>
      <View style={styMap.containerTime}>
        <Text>{serverTime}</Text>
      </View>
    </View>

  );
}
