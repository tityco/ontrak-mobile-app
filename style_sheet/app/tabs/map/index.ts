import { StyleSheet } from "react-native";


const styMap = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerTime: {
    position: 'absolute',
    bottom: 100,
    right: 10,
  }
});

export default styMap;