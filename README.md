# 🎥 FILMNETS

Generate Video NFTs with LivePeer.

# 🚧🚧🚧 WORK IN PROGRESS! 🚧🚧🚧

# Running React-native App

put your credentials manually here `app/screens/TabTwoScreen.tsx` L18:L20

      const LIVEPEER_API_KEY = "";
      const ALCHEMY_API_KEY = "";
      const PRIVATE_KEY = "";

currently only tested for ios simulator.
follow instructions here [ios simulator - expo](https://docs.expo.dev/workflow/ios-simulator/)

```
cd app
npx expo run:ios
```

# Interacting with videonft only.

## Setting up LivePeer

    npm install -g @livepeer/video-nft

more details here
https://docs.livepeer.studio/guides/mint-a-video-nft#minting-a-video-nft-using-livepeer-studio

## Manual Video Minting (For TESTING)

NOTE: (You will need to set up `MINTER_ROLE` access for the NFT contract [0x28AB8de902D88D0C07CD492C6fa60D7752a140F3](https://goerli.etherscan.io/address/0x28AB8de902D88D0C07CD492C6fa60D7752a140F3))

1. Getting video metadata via Livepeer command line tool

   ```
   npx @livepeer/video-nft assets/fun_in_iceland.mp4 --asset-name "Stuck in Iceland" --nft-metadata '{"description":"First NFT!!!!"}'
   ipfs://bafybeigphbyidypq5r36ur7hkskpipduijjcfimq3ijrcibabt72fkwzzm
   ```

2. Use videonft/scripts/mint-video.ts
3. Enjoy your nft!
