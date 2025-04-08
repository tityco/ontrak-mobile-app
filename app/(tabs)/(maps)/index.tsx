

import ParallaxScrollView from '@/components/ParallaxScrollView';
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
import { IconSymbol } from '@/components/ui/IconSymbol';
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
import mapInfoSlice from '@/redux-toolkit/mapInfoReducerSliceTookit';
import { mapInfoSelector, tagsInfoSelector } from '@/redux-toolkit/selectorToolkit';
import findingSlice from '@/redux-toolkit/findingReducerSliceTookit';
import tagService from '@/services/tag.service';
import tagsInfoSlice from '@/redux-toolkit/tagsInfoReducerSliceToolkit';

export default function MapScreen() {

  const navigation = useNavigation();
  const [loaded, setLoaded] = useState(false);

  const dispatch = useDispatch();
  const mapInfoStore = useSelector(mapInfoSelector);
  const tagsInfoStore = useSelector(tagsInfoSelector);
  
  const sceneRef = useRef(null);
  const { width, height } = Dimensions.get('window');
  const [start, setStart] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [finding, setFinding] = useState(false);
  const tagInfo = useRef<any>(null);
  const startRef = useRef(null);
  const destinationRef = useRef(null);
  const linePath = useRef(null);

  const [serverTime, setServerTime] = useState("Connecting...")

  let dt = (new Date()).getTime();

  const onContextCreate = async (gl: any) => {
    if (!loaded && !mapInfoStore) return;
    dispatch(findingSlice.actions.changeStart(''));
    dispatch(findingSlice.actions.chageDestination(''));
    ///start threemap
    threeMapService.contextCreate(gl, width, height, loaded, mapInfoStore, tagsInfoStore);
  };
  const genFindPath = () => {

    if (!startRef.current || !destinationRef.current) {

      if (linePath.current) {
        sceneRef.current.remove(linePath.current);
        linePath.current = null;
      }

      if (finding) {


        setFinding(false);
      }
    } else {

      if (!finding) {
        setFinding(true);
      }
      let points = [
        // new THREE.Vector3(82, 239, 10),  // Điểm đầu
        // new THREE.Vector3(452, 105, 10),   // Điểm cuối
      ];


      // Tạo material cho đường thẳng
      const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 });
      if (sceneRef.current && tagInfo.current) {


        let tagIndex = tagInfo.current.findIndex((item) => item.data.tagID == startRef.current.tagID);
        let tagIndex2 = tagInfo.current.findIndex((item) => item.data.tagID == destinationRef.current.tagID);
        if (tagIndex != -1 && tagIndex2 != -1 && sceneRef.current) {

          let points = [
            // new THREE.Vector3(82, 239, 10),  // Điểm đầu
            // new THREE.Vector3(452, 105, 10),   // Điểm cuối
          ];
          points.push(new THREE.Vector3(parseInt(tagInfo.current[tagIndex].data.x), parseInt(tagInfo.current[tagIndex].data.y), 10))
          points.push(new THREE.Vector3(parseInt(tagInfo.current[tagIndex2].data.x), parseInt(tagInfo.current[tagIndex2].data.y), 10))

          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          console.log(points)
          if (linePath.current)
            sceneRef.current.remove(linePath.current);
          // Tạo đường thẳng và thêm vào scene
          const line = new THREE.Line(geometry, material);
          linePath.current = line;
          console.log(line)
          sceneRef.current.add(line);
          // points.push(new THREE.Vector3(0,0, 10));
          // points.push(new THREE.Vector3(200, 200, 10))
        }

      }


    }

    // console.log("find")
  }

  const previousTouch = useRef({ x: 0, y: 0, distance: 0 });

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
    threeMapService.onReceivePosition(data);
  }
  const onReceivePing = (data:any)=>{
    setServerTime(data)
  }
  const configSignalR = () => {
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
  const initData = async () => {
    setLoaded(false);
    let dataMap = await mapService.getMapByID(MAP_ID);
    let tags = await tagService.getTagByMapID(MAP_ID);
    dispatch(mapInfoSlice.actions.changeMap(dataMap));
    dispatch(tagsInfoSlice.actions.changeTags(tags));
    configSignalR();
    setLoaded(true);
  }
  useEffect(() => {
    initData();
  }, []);

  const fetchDataLocal = async () => {
    const storedData = await AsyncStorage.getItem('selectedStart');
    if (storedData) {
      setStart(JSON.parse(storedData))
      startRef.current = JSON.parse(storedData)
    }
    const storedData2 = await AsyncStorage.getItem('selectedDestination');
    if (storedData2) {
      setDestination(JSON.parse(storedData2))
      destinationRef.current = JSON.parse(storedData2);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDataLocal();
    }, [])
  );


  const moveScreenSearch = (value) => {
    let tagInfoData = tagInfo.current.map((tag) => {
      return { id: tag.data.id, tagID: tag.data.tagID, icon: tag.data.icon, tagName: tag.data.tagName, x: tag.data.x, y: tag.data.y, status: tag.data.status }
    });
    navigation.navigate("search", { value: value, tagInfo: JSON.stringify(tagInfoData) })
  }
  const closeFinding = async () => {
    await AsyncStorage.setItem('selectedStart', '');
    await AsyncStorage.setItem('selectedDestination', '');
    setStart(null);
    setDestination(null)
    startRef.current = null;
    destinationRef.current = null
  }

  return (
    <View style={{ flex: 1 }} >

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
                <Text style={styles.title}>{start?.tagName ?? "Vị trí của bạn"}</Text>
              </View>

              <View style={styles.middleContainer}>
                <View style={styles.separator} />
              </View>

              <View
                style={styles.row}
                onTouchStart={(event) => moveScreenSearch("destination")}>
                <Text style={styles.address}>{destination?.tagName ?? "Điểm đến"}</Text>
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
                <Text style={styles.title}>{start?.tagName ?? "Vị trí của bạn"}</Text>
              </View>

              <View style={styles.middleContainer}>
                <View style={styles.separator} />
              </View>

              <View
                style={styles.row}
                onTouchStart={(event) => moveScreenSearch("destination")}>
                <Text style={styles.address}>{destination?.tagName ?? "Điểm đến"}</Text>
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
