import { StyleSheet } from "react-native";



const stylesRoot = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  background: {
    flex: 1
  },
  logo: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 50
  },
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '80%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10, backgroundColor: 'white', borderRadius: 10 },
  button: { backgroundColor: '#0A84FF', padding: 10, borderRadius: 10, width: '80%', alignItems: 'center', marginTop: 50 },
  buttonText: { color: 'white', fontSize: 18 },
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
  }
});
export default stylesRoot;