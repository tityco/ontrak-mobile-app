

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

import stylesMap from '@/style_sheet/app/tabs/map';
import { loadTextureFromURL, updatePositonTag } from '@/_helper/app/tabs/maps/index-heper';
import threeMapService from '@/services/three-map.service';
import { useDispatch, useSelector } from 'react-redux';
import { isLoadingMapScreenSelector, mapInfoSelector, tagsInfoSelector } from '@/redux-toolkit/selector/selector-toolkit';
import { useGetMapInfoQuery } from '@/redux-toolkit/api/mapInfo-api';
import findingSlice from '@/redux-toolkit/slice/finding-slice';
import mapInfoSlice from '@/redux-toolkit/slice/mapInfo-slice';
import { useGetListTagInfoQuery } from '@/redux-toolkit/api/tagInfio-api';
import listTagsInfoSlice from '@/redux-toolkit/slice/lsittagsInfo-slice';
import MapViewComponent from '@/components/map-view.component';
import loadingSlice from '@/redux-toolkit/slice/loading-slice';

export default function MapScreen() {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { data: mapInfo, error: mapError, isLoading: isLoadingMap } = useGetMapInfoQuery(MAP_ID);
  const { data: listTagInfo, error: tagError, isLoading: isLoadingTag} = useGetListTagInfoQuery(MAP_ID);
  const isLoadingData = isLoadingMap || isLoadingTag;
  const isLoading = useSelector(isLoadingMapScreenSelector);
  const mapInfoStore = useSelector(mapInfoSelector);
  const tagsInfoStore = useSelector(tagsInfoSelector);
  
  const [loaded, setLoaded] = useState(true);
  const { width, height } = Dimensions.get('window');
  const [finding, setFinding] = useState(false);
  const [serverTime, setServerTime] = useState("Connecting...")

  useEffect(() => {
    dispatch(loadingSlice.actions.setLoadingMapScreen('loadingmap'));
  },[]);
  useEffect(() => {
    if(!isLoadingMap && !isLoadingTag) {
      dispatch(loadingSlice.actions.removeLoadingMapScreen('loadingmap'));
    }
  },[isLoadingMap, isLoadingTag]);

  const onContextCreate = async (gl: any) => {
    if (!mapInfoStore) return;
    dispatch(findingSlice.actions.changeStart(null));
    dispatch(findingSlice.actions.chageDestination(null));
    //await threeMapService.contextCreate(gl, width, height, mapInfoStore, tagsInfoStore);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (event, gesture) => {
        threeMapService.onPanResponderGrant(event, gesture);
      },

      onPanResponderMove: (event, gesture) => {
        threeMapService.onPanResponderMove(event, gesture);
      },
      onPanResponderRelease: () => {
        threeMapService.onPanResponderRelease();
      },
    })
  ).current;

  const onReceivePosition = (data: any) => {
    //console.log((new Date()).toISOString(),">>>>>>>>>>>>>>>>")
    //if(dispatch)
    //sdispatch(listTagsInfoSlice.actions.updatePositonTag(data));
    // threeMapService.onReceivePosition(data);
  }
  const onReceivePing = (data:any)=>{
    //console.log(data);
   // setServerTime(data)
  }
  const configSignalR = () => {
    SignalRService.onDisconnectCallback = (error: any) => {
      setServerTime("Connecting...")
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

  useEffect(() => {
    setLoaded(false);
  }, []);

  useEffect(() => {
    if (!isLoadingData) {
      initData();
      setLoaded(true);
    }
  }, [mapInfo, listTagInfo]);

  const moveScreenSearch = (value:any) => {
    navigation.navigate("search", { value: value })
  }

  const closeFinding = async () => {
    // await AsyncStorage.setItem('selectedStart', '');
    // await AsyncStorage.setItem('selectedDestination', '');
    // setStart(null);
    // setDestination(null)
    // startRef.current = null;
    // destinationRef.current = null
  }

  return (
    <View style={{ flex: 1 }} >
      {isLoading && (
        <View style={stylesMap.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      </View>

      <SafeAreaView style={stylesMap.safeAreaView}>
        <View style={stylesMap.container}>
          <View style={stylesMap.infoBox}>
            <View style={stylesMap.itemIconStart}>
              <View style={stylesMap.blueCircle}>
                <View style={stylesMap.blueDot} />
              </View>
              <View style={stylesMap.dotsContainer}>
                <View style={stylesMap.dot} />
                <View style={stylesMap.dot} />
                <View style={stylesMap.dot} />
              </View>
              <View style={stylesMap.whiteCircle}>
                <View style={stylesMap.redDot} />
              </View>
            </View>
            <View style={stylesMap.containerSearch}>
              <View
                style={stylesMap.row}
                onTouchStart={(event) => moveScreenSearch("start")}>
                <Text style={stylesMap.title}>Vị trí của bạn</Text>
              </View>

              <View style={stylesMap.middleContainer}>
                <View style={stylesMap.separator} />
              </View>
              <View
                style={stylesMap.row}
                onTouchStart={(event) => moveScreenSearch("destination")}>
                <Text style={stylesMap.address}>Điểm đến</Text>
              </View>
            </View>

            <View style={stylesMap.itemIconEnd}>
              <View>
                {finding ? (
                  <Ionicons name="close" size={26} color="#000" onPress={closeFinding} />
                ) : (
                  <View></View>
                )}
              </View>
              <View style={stylesMap.dotsContainer}>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
      
      <View style={stylesMap.containertime}>
        <Text>{serverTime}</Text>
      </View>
    </View>

  );
}
