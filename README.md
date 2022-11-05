# 🎥 FILMNETS

Generate Video NFTs with LivePeer.

# 🚧🚧🚧 WORK IN PROGRESS! 🚧🚧🚧

# Setting up LivePeer

    npm install -g @livepeer/video-nft

more details here
https://docs.livepeer.studio/guides/mint-a-video-nft#minting-a-video-nft-using-livepeer-studio

# Manual Video Minting (For TESTING)

NOTE: (You will need to set up `MINTER_ROLE` access for the NFT contract [0x28AB8de902D88D0C07CD492C6fa60D7752a140F3](https://goerli.etherscan.io/address/0x28AB8de902D88D0C07CD492C6fa60D7752a140F3))

1. Getting video metadata via Livepeer command line tool

   ```
   npx @livepeer/video-nft assets/fun_in_iceland.mp4 --asset-name "Stuck in Iceland" --nft-metadata '{"description":"First NFT!!!!"}'
   ipfs://bafybeigphbyidypq5r36ur7hkskpipduijjcfimq3ijrcibabt72fkwzzm
   ```

2. Use videonft/scripts/mint-video.ts
3. Enjoy your nft!

# Running React-native App

Download [Expo](https://expo.dev/) for your chosen device  
Download your chosen wallet's mobile app for authentification

    cd app
    yarn install (if first time running)
    yarn start

Metro Bundler will generate a QR Code readable either through app (Android) or Camera (ios)
