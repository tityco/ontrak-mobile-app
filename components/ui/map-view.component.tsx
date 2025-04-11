import { GLView } from "expo-gl";
import { View,Text, ActivityIndicator } from "react-native";


export default function MapViewComponent() {

    
    return (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
            {!loaded ? (
            <ActivityIndicator size="large" color="#00ff00" style={{ flex: 1 }} />
            ) : (
            <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
            )}
        </View>
    );
}
 