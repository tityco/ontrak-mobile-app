import { StyleSheet } from "react-native";


const stylesMap = StyleSheet.create({
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
  safeAreaView: {
    position: 'absolute',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    flex: 1,
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemIconStart: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,

  },

  blueCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 122, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",


  },
  blueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF", 
    justifyContent: "center",
    alignItems: "center",

  },


  dotsContainer: {
    width: 20,
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,


  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#666",
    marginVertical: 2,
  },


  redMarker: {
    width: 20,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "red",
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "red",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    height: 40
  },
  containerSearch: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,

  },
  middleContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 5
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#DDD",
  },
  title: {
    fontSize: 16,
    color: "#007AFF",

  },
  address: {
    paddingTop: 2,
    fontSize: 16,
    color: "#333",
  },

  itemIconEnd: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,

  },
  containertime: {
    position: 'absolute',
    bottom: 100,
    right: 10,
  }
});

export default stylesMap;