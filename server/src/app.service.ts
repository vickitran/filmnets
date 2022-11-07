import { Injectable } from '@nestjs/common';
import * as nodePath from 'path';
import * as fs from 'fs';
import { path } from '@ffmpeg-installer/ffmpeg';
import { videonft } from '@livepeer/video-nft';
import { ethers } from 'ethers';
import * as ffmpeg from 'fluent-ffmpeg';
import * as dotenv from 'dotenv';

dotenv.config();

const convertVideo = (videoPath) => {
  return new Promise((resolve, _) => {
    const convertedFilePath = nodePath.resolve(__dirname, '../converted.mp4');
    console.log(`start to convert video file`);
    fs.createWriteStream(convertedFilePath);
    fs.createWriteStream(nodePath.resolve(__dirname, '../converted.divx'));
    ffmpeg.setFfmpegPath(path);
    ffmpeg(videoPath)
      .toFormat('mp4')
      .on('start', (commandLine) => {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
      })
      .on('error', (err) => {
        console.log('An error occurred: ' + err.message);
      })
      .on('end', () => {
        console.log(`Processing finished !`);
        resolve(convertedFilePath);
      })
      .save(convertedFilePath);
  });
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async createAsset(videoPath: string, assetName: string): Promise<string> {
    // overwrite default videoNft mint function api
    const videoNftAbi = [
      'event safeMint(address indexed sender, address indexed owner, string tokenURI, uint256 tokenId)',
      'function safeMint(address owner, string tokenURI) returns (uint256)',
    ];

    console.log(`live key: ${process.env.LIVEPEER_API_KEY}`);
    const apiOpts = {
      auth: { apiKey: process.env.LIVEPEER_API_KEY },
      endpoint: videonft.api.prodApiEndpoint,
    };
    // TODO: get signer from FE
    const provider = new ethers.providers.AlchemyProvider(
      'goerli',
      process.env.ALCHEMY_API_KEY,
    );
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? '');
    const signer = wallet.connect(provider);

    const nftAPI = new videonft.minter.Api(apiOpts);
    const convertedFilePath = await convertVideo(videoPath);
    console.log(`start to create asset`);
    // sleep 5 secondes before read converted file
    await new Promise((resolve) => setTimeout(resolve, 15000));

    const fileContent = fs.createReadStream(convertedFilePath as string);

    // TODO: get asset name from FE
    const asset = await nftAPI.createAsset(assetName, fileContent);
    console.log(`export to IPFS`);
    const { nftMetadataUrl } = await nftAPI.exportToIPFS(asset.id);
    console.log(`export video to ipfs: ${nftMetadataUrl}`);

    // TODO: move contract address to a constant
    const videoNft = new ethers.Contract(
      '0xE710666F5C687e16CD8e71756C9E0833B05B1758',
      videoNftAbi,
      signer,
    );
    await videoNft.safeMint(signer.address, nftMetadataUrl);

    return nftMetadataUrl;
  }
}
