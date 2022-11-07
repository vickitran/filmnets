import { StyleSheet, Button } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Video } from "expo-av";
import { useState } from 'react';
import * as filePicker from 'expo-image-picker';
import { useWalletConnect } from "@walletconnect/react-native-dapp";

export default function TabTwoScreen() {
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
    // TODO: uri is not exact same as it stored in the ios simulator. hack to get correct uri for read file in BE
    const newUri = uri.replaceAll('%25', '%')
    console.log(`new uri: ${newUri}`);
    setVideoUri(newUri);


    const formData = new FormData();
    formData.append('video',JSON.stringify({
      uri: newUri,
      fileName: 'placeholder-fileName',
      type: `video/mov`
    }));
    console.log(`formData: ${formData}`)

    const res = await fetch("http://localhost:3000/create-asset", {
      method: 'post',
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data; boundary=——file",
        'Accept': '*/*' 
      }
    })
    console.log(`res: ${JSON.stringify(res)}`)
    // console.log(res.body)
    // const t = await fetch(pickerResult.uri)
    
    // const b = await t.blob();
    // await createAssetAPI(formData, LIVEPEER_API_KEY)
    
    
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
