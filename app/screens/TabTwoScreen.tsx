import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

import { Image, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { videonft } from "@livepeer/video-nft";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import * as RNFS from "react-native-fs";
import { useCallback, useState, useEffect } from "react";
// Import the ethers library
import { ethers } from "ethers";
import * as fs from "fs";

export default function TabTwoScreen() {
  const [videoUploaded, setvideoUploaded] = useState(false);
  const convertedFilePath = RNFS.DocumentDirectoryPath + "/file1.mp4";
  const LIVEPEER_API_KEY = "";
  const ALCHEMY_API_KEY = "";
  const PRIVATE_KEY = "";

  let openImagePickerAsync = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    FFmpegKit.execute(
      `-i "${pickerResult.uri}" -c:v mpeg4 -y ${convertedFilePath}`
    ).then(async (session) => {
      const returnCode = await session.getReturnCode();
      setvideoUploaded(true);
    });
  };
  let mintVideoNFT = async () => {
    // overwrite default videoNft mint function api
    const videoNftAbi = [
      "event safeMint(address indexed sender, address indexed owner, string tokenURI, uint256 tokenId)",
      "function safeMint(address owner, string tokenURI) returns (uint256)",
    ];

    console.log(`live key: ${LIVEPEER_API_KEY}`);
    const apiOpts = {
      auth: { apiKey: LIVEPEER_API_KEY },
      endpoint: videonft.api.prodApiEndpoint,
    };
    // TODO: get signer from FE
    const provider = new ethers.providers.AlchemyProvider(
      "goerli",
      ALCHEMY_API_KEY
    );
    const wallet = new ethers.Wallet(`${PRIVATE_KEY}`, provider);
    const signer = wallet.connect(provider);

    const nftAPI = new videonft.minter.Api(apiOpts);

    // TODO: get asset name from FE
    const assetName = "test";

    const fileContent = await RNFS.readFile(
      convertedFilePath as string,
      "base64"
    );

    console.log(`creating an asset`);
    const asset = await nftAPI.createAsset(assetName, fileContent);
    console.log(`export to IPFS`);
    const { nftMetadataUrl } = await nftAPI.exportToIPFS(asset.id);
    console.log(`export video to ipfs: ${nftMetadataUrl}`);

    // TODO: move contract address to a constant
    const videoNft = new ethers.Contract(
      "0xE710666F5C687e16CD8e71756C9E0833B05B1758",
      videoNftAbi,
      signer
    );
    await videoNft.safeMint(signer.address, nftMetadataUrl);

    console.log(nftMetadataUrl);
  };
  const videoText = videoUploaded ? "Video uploaded" : "Upload your video";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mint your NFT</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TouchableOpacity
        onPress={openImagePickerAsync}
        disabled={videoUploaded}
        style={styles.buttonStyle}
      >
        <Text style={styles.buttonTextStyle}>{videoText}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={mintVideoNFT}
        disabled={!videoUploaded}
        style={styles.buttonStyle}
      >
        <Text style={styles.buttonTextStyle}>Mint!</Text>
      </TouchableOpacity>
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
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
