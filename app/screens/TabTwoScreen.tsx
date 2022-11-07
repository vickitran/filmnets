import { StyleSheet, Button } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Video } from "expo-av";
import { useState } from 'react';
import * as filePicker from 'expo-image-picker';
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import * as fileSystem from 'expo-file-system';

export default function TabTwoScreen() {
  // TODO: check wallet connector
  const connector = useWalletConnect();
  console.log(connector.accounts);
  const [videoUri, setVideoUri] = useState<string | null>(null)
  const handleUpdateVideo = async () => { 
    const pickerResult = await filePicker.launchImageLibraryAsync({
      mediaTypes: filePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64:true,
    });
   
    if (pickerResult.cancelled === true) {
      return;
    }
   
    const { uri } = pickerResult
  
    const fileContent = await fileSystem.readAsStringAsync(uri, { encoding: fileSystem.EncodingType.Base64 })
    console.log(`orgContent: ${typeof fileContent}`)

    setVideoUri(fileContent);


    const res = await fetch("http://localhost:3000/create-asset", {
      method: 'post',
      body: JSON.stringify({data: fileContent}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    console.log(`res: ${JSON.stringify(res)}`)  
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload your video</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Some text</Text>
      {videoUri && 
        <Video
          style={styles.video}
          resizeMode="contain"
          source={{
            uri: videoUri,
          }}
          useNativeControls={true}
          isLooping={true}
        />
      }
      <Button title="test" onPress={handleUpdateVideo} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  video: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});
