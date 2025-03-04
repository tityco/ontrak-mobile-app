
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as FileSystem from 'expo-file-system';
import React, { useRef, useEffect, useState } from 'react';
import { View, PanResponder, Dimensions, StyleSheet, ActivityIndicator, Text, TextInput,Image } from 'react-native';
import { Renderer, TextureLoader } from 'expo-three';
import { THREE } from 'expo-three';
import { GLView } from 'expo-gl';
import * as SplashScreen from 'expo-splash-screen';
import axios from "axios";
import { Asset } from 'expo-asset';
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import SignalRService from '@/components/SignalRService';
import { MAP_ID, USER_ID, MOVE_SPEED } from '@/constants/Constant';

import { Group, Tween, Easing } from '@tweenjs/tween.js';

const tweenGroup = new Group();


export default function MapScreen() {
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
  const tagInfo = useRef(null);

  const onContextCreate = async (gl) => {
    if (!loaded) return; // 🔹 Đảm bảo không chạy nếu chưa load xong

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


    const render = (time) => {
      requestAnimationFrame(render);
      tweenGroup.update(time);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();


  };
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
  const previousTouch = useRef({ x: 0, y: 0, distance: null });

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
          // 🔹 Xử lý ZOOM
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


  const loadTextureFromURL = async (imageUrl) => {
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

  });
  useEffect(() => {
    fetchData();
    SignalRService.startConnection();


    SignalRService.on("SendPing", (msg) => {
      //onsole.log("SendPing:", msg);

    });
    SignalRService.on("Send", (msg) => {


    });
    SignalRService.on("SendPosition", (data) => {


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

    SignalRService.on("Connected", (msg) => {


    });
    SignalRService.on("sendbasestation", (msg) => {
      //console.log(" Connected212:", SignalRService);

      //  SignalRService.JoinGroup(1,2020);

    })


  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://ontrak.live/MapApi/GetMapByID?id=${MAP_ID}`, {
        timeout: 5000, // Giới hạn request 5s
      });
      mapInfo.current = response.data;
      setLoaded(true);
      return response.data;
    } catch (error) {
      setLoaded(true);
      return null;
    }
  };

  return (
    <View style={{ flex: 1 }} >

      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        {!loaded ? (

          <ActivityIndicator size="large" color="#00ff00" style={{ flex: 1 }} />
        ) : (

          <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
        )}

      </View>

      <View style={styles.searchContainer}>
      <Image
       source={require('@/assets/images/react-logo.png')}  
        style={styles.icon}
      />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm địa điểm"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />


      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 5, // Đổ bóng cho Android
    shadowColor: '#000', // Đổ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchInput: {
    height: 40,
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  icon: {

    width: 40,
    height: 40,
    marginHorizontal: 5,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  }
});
