
import { HelloWave } from '@/components/HelloWave';
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
import { Group, Tween, Easing } from '@tweenjs/tween.js';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightSpeedInLeft } from 'react-native-reanimated';
import SignalRService from '@/services/signalr.service'

import styles from '@/style_sheet/app/tabs/map';
const tweenGroup = new Group();


export default function MapScreen() {

  const [isVisibleClose, setIsVisibleClose] = useState(false);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [loaded, setLoaded] = useState(false);
  const [textureUri, setTextureUri] = useState('');
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const ratioRef = useRef(null);
  const mapInfo = useRef(null);
  const scaleTagRef = useRef(null);
  const { width, height } = Dimensions.get('window');
  const [searchQuery, setSearchQuery] = useState('');
  const [start, setStart] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [finding, setFinding] = useState(false);
  const tagInfo = useRef(null);
  const startRef = useRef(null);
  const destinationRef = useRef(null);
  const linePath = useRef(null);

  const [serverTime, setServerTime] = useState("Connecting...")

  let dt = (new Date()).getTime();

  const onContextCreate = async (gl) => {
    if (!loaded) return; //  Đảm bảo không chạy nếu chưa load xong
    await AsyncStorage.setItem('selectedStart', '');
    await AsyncStorage.setItem('selectedDestination', '');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    const aspect = width / height;
    ratioRef.current = gl.drawingBufferWidth / width;
    sceneRef.current = scene;
    const frustumSize = 1; // Kích thước không gian nhìn thấy
    const camera = new THREE.OrthographicCamera(
      -width, // left
      width,  // right
      height,  // top
      -height, // bottom
      0.1,  // near
      10000  // far
    );
    camera.position.z = mapInfo.current.targetPointZ;
    camera.position.x = mapInfo.current.targetPointX;
    camera.position.y = mapInfo.current.targetPointY;

    if (1.2 / camera.zoom >= 15) {
      scaleTagRef.current = 15;
    } else {
      scaleTagRef.current = 1.2 / camera.zoom;
    }
    cameraRef.current = camera;

    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    rendererRef.current = renderer;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);


    let floorTexture = await loadTextureFromURL(`https://ontrak.live${mapInfo.current.imgLink.replace(/\\/g, "/")}`);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);

    const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });

    let floorGeometry = new THREE.PlaneGeometry(mapInfo.current.widthMap, mapInfo.current.heightMap, 1, 1);
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.scale.x = mapInfo.current.scaleMap;
    floor.scale.y = mapInfo.current.scaleMap;
    floor.position.y = mapInfo.current.mapY;
    floor.position.z = 0;
    floor.position.x = mapInfo.current.mapX;
    floor.rotation.z = mapInfo.current.angleViewMap * Math.PI / 180;
    scene.add(floor);
    getTag();

    dt
    const render = (time) => {
      requestAnimationFrame(render);
      tweenGroup.update(time);
      if (((new Date()).getTime() - dt) >= 500) {
        genFindPath();
        dt = (new Date()).getTime();
      };

      renderer.render(scene, camera);

      gl.endFrameEXP();
    };
    render();


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
  const moveBoxAlongPath = (tag) => {
    const coords = { x: tag.obj3D.position.x, y: tag.obj3D.position.y };
    const tween = new Tween(coords, tweenGroup)
      .to({ x: tag.data.x, y: tag.data.y }, MOVE_SPEED) // Thời gian di chuyển giữa các điểm
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        tag.obj3D.position.set(coords.x, coords.y, 0);
      })
      .onComplete(() => {
        moveBoxAlongPath(tag);
      })
      .start();

  }

  const getTag = async () => {
    const response = await axios.get(`https://ontrak.live/TagMapApi/SelectAllBuyMapID?mapid=${MAP_ID}`, {
      timeout: 5000, // Giới hạn request 5s
    });
    tagInfo.current = [];
    if (!response || !response.data) return;
    if (response.data.length == 0) return;
    for (var i = 0; i < response.data.length; i++) {
      let tagTexture = await loadTextureFromURL(`https://ontrak.live${response.data[i].icon.replace(/\\/g, "/")}`);

      let geometryTag = new THREE.BoxGeometry(50, 50, 50);
      var materialTag = new THREE.MeshBasicMaterial({
        transparent: true,
        map: tagTexture,
        side: THREE.DoubleSide
      });
      var objTagDisplay = new THREE.Mesh(geometryTag, materialTag);
      objTagDisplay.position.y = 0;
      var an = mapInfo.current.angleViewCamera;
      objTagDisplay.rotation.z = 3.14 * (180 - an) / 180;
      objTagDisplay.position.z = 5;//10 + 2 * (data.length - i);
      objTagDisplay.scale.x = scaleTagRef.current;
      objTagDisplay.scale.y = scaleTagRef.current;
      objTagDisplay.position.x = response.data[i].x;
      objTagDisplay.position.y = response.data[i].y;
      objTagDisplay.visible = false;
      let tagI = { obj3D: objTagDisplay, data: response.data[i] };
      moveBoxAlongPath(tagI)
      tagInfo.current.push(tagI);

      //objTagDisplay.data = esponse.data[i];
      sceneRef.current.add(objTagDisplay);
    }

    //  console.log(response.data);
  }
  const previousTouch = useRef({ x: 0, y: 0, distance: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (event, gesture) => {
        if (gesture.numberActiveTouches === 2) {
          // 🔹 Lưu khoảng cách giữa 2 ngón tay
          const [touch1, touch2] = event.nativeEvent.touches;
          const dx = touch1.pageX - touch2.pageX;
          const dy = touch1.pageY - touch2.pageY;
          previousTouch.current.distance = Math.sqrt(dx * dx + dy * dy);
        } else {
          previousTouch.current.x = gesture.x0;
          previousTouch.current.y = gesture.y0;
        }
      },

      onPanResponderMove: (event, gesture) => {
        if (!cameraRef.current) return;

        if (gesture.numberActiveTouches === 2) {

          const [touch1, touch2] = event.nativeEvent.touches;
          const dx = touch1.pageX - touch2.pageX;
          const dy = touch1.pageY - touch2.pageY;
          const newDistance = Math.sqrt(dx * dx + dy * dy);

          if (previousTouch.current.distance && newDistance > 0) {
            const zoomFactor = previousTouch.current.distance / newDistance;
            let zoom = cameraRef.current.zoom / zoomFactor;

            // 🔹 Giới hạn zoom (tránh quá nhỏ hoặc quá lớn)
            cameraRef.current.zoom = Math.min(Math.max(zoom, 0.0005), 5000);
            cameraRef.current.updateProjectionMatrix();
            if (1.2 / cameraRef.current.zoom >= 15) {
              scaleTagRef.current = 15;
            } else {
              scaleTagRef.current = 1.2 / cameraRef.current.zoom;
            }
            if (tagInfo.current) {
              tagInfo.current.forEach(tagI => {
                tagI.obj3D.scale.x = scaleTagRef.current;
                tagI.obj3D.scale.y = scaleTagRef.current;
              });
            }

            // 🔹 Lưu khoảng cách mới
            previousTouch.current.distance = newDistance;
          }
        } else {
          // 🔹 Xử lý PAN
          const { moveX, moveY } = gesture;
          const deltaX = (moveX - previousTouch.current.x) * 2 / width * cameraRef.current.right;
          const deltaY = (moveY - previousTouch.current.y) * 2 / height * cameraRef.current.top;

          cameraRef.current.position.x -= deltaX / cameraRef.current.zoom;
          cameraRef.current.position.y += deltaY / cameraRef.current.zoom;

          previousTouch.current.x = moveX;
          previousTouch.current.y = moveY;
        }
      },

      onPanResponderRelease: () => {
        previousTouch.current.distance = null;
      },
    })
  ).current;


  const loadTextureFromURL = async (imageUrl: any) => {
    try {

      const fileUri = `${FileSystem.cacheDirectory}${imageUrl.replace(/\\/g, "").replace(/\//g, "")}temp_texture.jpg`;
      await FileSystem.downloadAsync(imageUrl, fileUri);


      const texture = new TextureLoader().load(fileUri);
      return texture;
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchData();

    SignalRService.onDisconnectCallback = (error: any) => {
      setServerTime("Connecting...")
    }

    SignalRService.startConnection();

    SignalRService.on("SendPing", (msg: any) => {
      setServerTime(msg)
    });

    SignalRService.on("Send", (msg: any) => {
    });

    SignalRService.on("SendPosition", (data: any) => {
      for (var k = 0; k < data.length; k++) {
        if (!tagInfo.current) return;
        let tagIndex = tagInfo.current.findIndex((item) => item.data.tagID == data[k].tagID);
        if (tagIndex != -1) {
          tagInfo.current[tagIndex].data.x = data[k].x;
          tagInfo.current[tagIndex].data.y = data[k].y;
          if (data[k].status != 4) {
            tagInfo.current[tagIndex].obj3D.visible = true;
          }
        }
      }
    });

    SignalRService.on("Connected", (msg: any) => {

    });
    SignalRService.on("sendbasestation", (msg: any) => {
    })
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

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://ontrak.live/MapApi/GetMapByID?id=${MAP_ID}`, {
        timeout: 5000, 
      });
      mapInfo.current = response.data;
      setLoaded(true);
      return response.data;
    } catch (error) {
      setLoaded(true);
      return null;
    }
  };

  const moveScreenSearch = (value) => {
    let tagInfoData = tagInfo.current.map((tag) => {
      return { id: tag.data.id, tagID: tag.data.tagID, icon: tag.data.icon, tagName: tag.data.tagName, x: tag.data.x, y: tag.data.y, status: tag.data.status }
    });
    navigation.navigate("search", { value: value, tagInfo: JSON.stringify(tagInfoData) })
  }
  const closeFinding = async () => {
    const storedData = await AsyncStorage.setItem('selectedStart', '');

    const storedData2 = await AsyncStorage.setItem('selectedDestination', '');
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
