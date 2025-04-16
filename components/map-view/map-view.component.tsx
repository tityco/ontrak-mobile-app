import { GLView } from "expo-gl";
import { useRef } from "react";
import { View, Text, ActivityIndicator, PanResponder } from "react-native";
import { useDispatch } from "react-redux";


export default function MapViewComponent() {
  const dispatch = useDispatch();
  
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
        //threeMapService.onPanResponderGrant(event, gesture);
      },

      onPanResponderMove: (event, gesture) => {
       // threeMapService.onPanResponderMove(event, gesture);
      },
      onPanResponderRelease: () => {
       // threeMapService.onPanResponderRelease();
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </View>
  );
}
