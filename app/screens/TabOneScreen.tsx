import { useCallback, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import { useWalletConnect } from "@walletconnect/react-native-dapp";

// Pull in the shims (BEFORE importing ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";

async function getBalance(address: string) {
  const network = "goerli";
  const provider = ethers.getDefaultProvider(network);
  const balanceBN = await provider.getBalance(address);
  const balanceETH = ethers.utils.formatEther(balanceBN);
  return balanceETH;
}

function TabOneScreen({ navigation }: RootTabScreenProps<"TabOne">) {
  const [balance, setBalance] = useState("Loading...");

  const connector = useWalletConnect();

  const connectWallet = useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = useCallback(() => {
    return connector.killSession();
  }, [connector]);

  useEffect(() => {
    if (!!connector.connected) {
      (async () => {
        const walletbalance = await getBalance(connector.accounts[0]);
        console.log(walletbalance);
        setBalance(walletbalance);
      })();
    }
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet} style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {!!connector.connected && (
        <>
          <Text>{connector.accounts[0]}</Text>
          <Text>{balance}</Text>
          <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Log out</Text>
          </TouchableOpacity>
        </>
      )}
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

export default TabOneScreen;
