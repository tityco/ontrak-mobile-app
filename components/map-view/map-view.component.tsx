import { mapInfoSelector, pathInfoSelector, tagsInfoSelector } from "@/redux-toolkit/selector/selector-toolkit";
import findingSlice from "@/redux-toolkit/slice/finding-slice";
import threeMapService from "@/services/three-map.service";
import { GLView } from "expo-gl";
import { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, PanResponder, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";


export default function MapViewComponent() {
  const dispatch = useDispatch();
  const { width, height } = Dimensions.get("window");
  const mapInfoStore = useSelector(mapInfoSelector);
  const tagsInfoStore = useSelector(tagsInfoSelector);
  const pathsInfoStore = useSelector(pathInfoSelector);
  const [gl, setGl] = useState(null);
  const InitMapView = async () => {
    await threeMapService.contextCreate( gl, width, height, mapInfoStore, tagsInfoStore, pathsInfoStore);
  }
  
  useEffect(() => {
    if(!mapInfoStore) return;
    if(!tagsInfoStore) return;
    if(!gl) return;
    InitMapView();
  }, [mapInfoStore, mapInfoStore, gl]);

  const onContextCreate = async (gl: any) => {
    setGl(gl);
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

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </View>
  );
}
