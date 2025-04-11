

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

import styles from '@/style_sheet/app/tabs/map';
import mapService from '@/services/map.service';
import { loadTextureFromURL, updatePositonTag } from '@/_helper/app/tabs/maps/index-heper';
import threeMapService from '@/services/three-map.service';
import { useDispatch, useSelector } from 'react-redux';
import { mapInfoSelector, tagsInfoSelector } from '@/redux-toolkit/selector/selector-toolkit';
import tagService from '@/services/tag.service';
import { useGetMapInfoQuery } from '@/redux-toolkit/api/mapInfo-api';
import findingSlice from '@/redux-toolkit/slice/finding-slice';
import mapInfoSlice from '@/redux-toolkit/slice/mapInfo-slice';
import { useGetListTagInfoQuery } from '@/redux-toolkit/api/tagInfio-api';
import listTagsInfoSlice from '@/redux-toolkit/slice/lsittagsInfo-slice';
import { isLoading } from 'expo-font';
import MapViewComponent from '@/components/ui/map-view.component';



export default function MapScreen() {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { data: mapInfo, error: mapError, isLoading: isLoadingMap } = useGetMapInfoQuery(MAP_ID);
  const { data: listTagInfo, error: tagError, isLoading: isLoadingTag} = useGetListTagInfoQuery(MAP_ID);
  const isLoadingData = isLoadingMap || isLoadingTag;


  const mapInfoStore = useSelector(mapInfoSelector);
  const tagsInfoStore = useSelector(tagsInfoSelector);
  
  const [loaded, setLoaded] = useState(true);
  const { width, height } = Dimensions.get('window');
  const [finding, setFinding] = useState(false);
  const [serverTime, setServerTime] = useState("Connecting...")

  const onContextCreate = async (gl: any) => {
    if (!isLoading && !mapInfoStore) return;
    dispatch(findingSlice.actions.changeStart(null));
    dispatch(findingSlice.actions.chageDestination(null));
  //  await threeMapService.contextCreate(gl, width, height, mapInfoStore, tagsInfoStore);
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
    console.log(data);
   // setServerTime(data)
  }
  const configSignalR = () => {
    console.log("configSignalR");
      
    SignalRService.onDisconnectCallback = (error: any) => {
      setServerTime("Connecting...")
    }
    SignalRService.startConnection();
    SignalRService.on("SendPing", onReceivePing);
    SignalRService.on("SendPosition", onReceivePosition);
    SignalRService.on("Connected", (msg: any) => {
    });
    SignalRService.on("sendbasestation", (msg: any) => {
    })
  }

  const initData = () => {
    dispatch(mapInfoSlice.actions.changeMap(mapInfo));
    dispatch(listTagsInfoSlice.actions.changeTags(listTagInfo));
    configSignalR();
    setInterval(() => {
      console.log((new Date()).toISOString(),SignalRService.connection._connectionState)
    }, 500);
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
      {/* <MapViewComponent></MapViewComponent> */}
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        {!loaded ? (
          <ActivityIndicator size="large" color="#00ff00" style={{ flex: 1 }} />
        ) : (
          <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
        )}
      </View>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <View style={styles.infoBox}>
            <View style={styles.itemIconStart}>
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
                onTouchStart={(event) => moveScreenSearch("start")}
              >
                <Text style={styles.title}>Vị trí của bạn</Text>
              </View>

              <View style={styles.middleContainer}>
                <View style={styles.separator} />
              </View>

              <View
                style={styles.row}
                onTouchStart={(event) => moveScreenSearch("destination")}>
                <Text style={styles.address}>Điểm đến</Text>
              </View>
            </View>

            <View style={styles.itemIconEnd}>
              <View>
                {finding ? (
                  <Ionicons name="close" size={26} color="#000" onPress={closeFinding} />

                ) : (
                  <View></View>
                )}

              </View>
              <View style={styles.dotsContainer}>

              </View>



            </View>
          </View>
        </View>

      </SafeAreaView>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <View style={styles.infoBox}>
            <View style={styles.itemIconStart}>
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
                onTouchStart={(event) => moveScreenSearch("start")}
              >
                <Text style={styles.title}>Vị trí của bạn</Text>
              </View>

              <View style={styles.middleContainer}>
                <View style={styles.separator} />
              </View>

              <View
                style={styles.row}
                onTouchStart={(event) => moveScreenSearch("destination")}>
                <Text style={styles.address}>Điểm đến</Text>
              </View>
            </View>

            <View style={styles.itemIconEnd}>
              <View>
                {finding ? (
                  <Ionicons name="close" size={26} color="#000" onPress={closeFinding} />

                ) : (
                  <View></View>
                )}

              </View>
              <View style={styles.dotsContainer}>

              </View>



            </View>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.containertime}>
        <Text>{serverTime}</Text>
      </View>
    </View>

  );
}
