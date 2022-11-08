import { StyleSheet, Button, TextInput } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View,  } from "../components/Themed";
import { Video } from "expo-av";
import { useState } from 'react';
import * as filePicker from 'expo-image-picker';
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import * as fileSystem from 'expo-file-system';

export default function TabTwoScreen() {
  // TODO: check wallet connector
  const connector = useWalletConnect();
  console.log(connector.accounts);

  const [videoName, setVideoName] = useState('');  
  const [videoUri, setVideoUri] = useState<string>('')
  const [videoType, setVideoType] = useState<string>('')
  const handlePickVideo = async () => { 
    const pickerResult = await filePicker.launchImageLibraryAsync({
      mediaTypes: filePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64:true,
    });
   
    if (pickerResult.cancelled === true) {
      return;
    }
    const { uri } = pickerResult
    setVideoUri(uri);
    const splitedUri = uri.split('/')
    const videoName = splitedUri[splitedUri.length - 1].split('.');
    setVideoType(videoName[videoName.length - 1]);
  }
  const handleUploadVideo = async () => { 
    console.log('start upload and mint')
    const fileContent = await fileSystem.readAsStringAsync(videoUri, { encoding: fileSystem.EncodingType.Base64 });
    const res = await fetch("http://localhost:3000/create-asset", {
      method: 'post',
      body: JSON.stringify({
        data: fileContent,
        videoName,
        videoType,
        signer: connector.accounts[0] ?? 'placeholder'
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    // TODO: set correct response in FE and BE
    console.log(`res: ${JSON.stringify(res)}`)  
  }
  return (
    <View style={styles.container}> 
      {videoUri ?
        <Text style={styles.title}>Mint your video</Text> : <Text style={styles.title}>Pick your video</Text>
      }
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {videoUri? 
        <>
          <Video
            style={styles.video}
            resizeMode="contain"
            source={{
              uri: videoUri,
            }}
            useNativeControls={true}
            isLooping={true}
          />
          <TextInput
            style={styles.input}
            onChangeText={setVideoName}
            value={videoName}
            placeholder="video name"
          />
          <Button title="mint ntf" onPress={handleUploadVideo} />
        </>
      : <Button title="pick a video" onPress={handlePickVideo} />}
      
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
    alignSelf: 'center',
    width: 340,
    height: 230,
  },
  input: {
    width: 340,
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#acacac',
    padding: 10,
    borderRadius: 1,
    alignSelf: 'center',
    marginVertical: 15
  },
});
