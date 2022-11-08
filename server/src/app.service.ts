import { Injectable } from '@nestjs/common';
import * as nodePath from 'path';
import * as fs from 'fs';
import { path } from '@ffmpeg-installer/ffmpeg';
import { videonft } from '@livepeer/video-nft';
import { ethers } from 'ethers';
import * as ffmpeg from 'fluent-ffmpeg';
import * as dotenv from 'dotenv';
import * as childProcess from 'child_process';

dotenv.config();

const convertVideoStream = (video, outputPath) => {
  return new Promise((resolve, _) => {
    console.log(`start to convert video file`);
    ffmpeg.setFfmpegPath(path);
    ffmpeg(video)
      .toFormat('mp4')
      .on('start', (_) => {
        console.log('Spawned Ffmpeg with command:');
      })
      .on('error', (err) => {
        console.log('An error occurred: ' + err.message);
      })
      .on('end', () => {
        console.log(`Processing finished !`);
        resolve('done');
      })
      .save(outputPath);
  });
};

@Injectable()
export class AppService {
  async createAsset(video64BasedContent: string): Promise<string> {
    console.log(`process mint`);
    // overwrite default videoNft mint function api
    const videoNftAbi = [
      'event safeMint(address indexed sender, address indexed owner, string tokenURI, uint256 tokenId)',
      'function safeMint(address owner, string tokenURI) returns (uint256)',
    ];
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
    // TODO: get file type from body
    const orgFilePath = nodePath.resolve(__dirname, '../convertedTest.mov');
    const convertedFilePath = nodePath.resolve(
      __dirname,
      '../convertedTest.mp4',
    );

    console.log(`start to convert video`);

    fs.writeFileSync(orgFilePath as string, video64BasedContent, 'base64');
    await convertVideoStream(orgFilePath, convertedFilePath);

    const fileContent = fs.createReadStream(convertedFilePath as string);

    console.log(`start to create asset`);

    // TODO: get asset name from FE
    // TODO: 520 error of connection
    const asset = await nftAPI.createAsset('new-test-2', fileContent);

    console.log(`export to IPFS`);
    const { nftMetadataUrl } = await nftAPI.exportToIPFS(asset?.id);
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

  async convertVideo(video64BasedContent: string, videoType: string, videoName: string): Promise<string> {
    // get input file type
    const orgFilePath = nodePath.resolve(__dirname, `../${videoName}.${videoType}`);
    const convertedFilePath = nodePath.resolve(
      __dirname,
      `../${videoName}.mp4`,
    );

    console.log(`start to convert video`);
    fs.writeFileSync(orgFilePath as string, video64BasedContent, 'base64');
    await convertVideoStream(orgFilePath, convertedFilePath);
    fs.unlinkSync(orgFilePath);
    return convertedFilePath;
  }

  async createAssetLivePeer(convertedFilePath: string, videoName: string): Promise<string> { 
    const apiOpts = {
      auth: { apiKey: process.env.LIVEPEER_API_KEY },
      endpoint: videonft.api.prodApiEndpoint,
    };
    const nftAPI = new videonft.minter.Api(apiOpts);

    const fileContent = fs.createReadStream(convertedFilePath as string);

    console.log(`start to create asset`);
    // TODO: 520 error of connection
    try {
      const asset = await nftAPI.createAsset(videoName, fileContent);
      console.log(`export to IPFS`);
      const { nftMetadataUrl } = await nftAPI.exportToIPFS(asset?.id);
      console.log(`export video to ipfs: ${nftMetadataUrl}`);
      fs.unlinkSync(convertedFilePath);
      return nftMetadataUrl;
    } catch (err) {
      const { message } = err;
      if (message.includes('520 Server Error')) {
        const hackWayGetAssetId = message.split('failed (520 Server Error)');
        const stringWithAssetId = hackWayGetAssetId[0].split('/');
        console.log('520 Server Error');
        const taskId = stringWithAssetId[stringWithAssetId.length - 1].trim();
        const curlCommand = `curl --location --request GET "https://livepeer.studio/api/task/${taskId}" --header "Authorization: Bearer ${process.env.LIVEPEER_API_KEY}"`;
        const resp = childProcess.execSync(curlCommand).toString();
        const { outputAssetId } = JSON.parse(resp);
        console.log(outputAssetId);

        let resultIPFSUrl;
        let flag = true;
        let i = 1;
        while (flag) {
          try {
            const { nftMetadataUrl } = await nftAPI.exportToIPFS(outputAssetId);
            resultIPFSUrl = nftMetadataUrl;
            flag = false;
          } catch (err) {
            const { message } = err;
            
            if (message.includes('asset is not ready to be exported')) {
              i = i + 1;
              console.log(`asset is not ready at ${i} round`);
              }
            }
        }
        console.log('520 Server Error 2');
        fs.unlinkSync(convertedFilePath);
        return resultIPFSUrl;
      }
    }
  }

  async mintNFTLivePeer(nftMetadataUrl: string, signerAddress: string ) {
    console.log(`process mint: ${nftMetadataUrl}`);
    // overwrite default videoNft mint function api
    const videoNftAbi = [
      'event safeMint(address indexed sender, address indexed owner, string tokenURI, uint256 tokenId)',
      'function safeMint(address owner, string tokenURI) returns (uint256)',
    ];
    // TODO: get signer from FE
    const provider = new ethers.providers.AlchemyProvider(
      'goerli',
      process.env.ALCHEMY_API_KEY,
    );
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? '');
    const signer = wallet.connect(provider);

    // TODO: move contract address to a constant
    const videoNft = new ethers.Contract(
      '0x28ab8de902d88d0c07cd492c6fa60d7752a140f3',
      videoNftAbi,
      signer,
    );
    const tx = await videoNft.safeMint(
      signerAddress !== 'placeholder' ? signerAddress : signer.address,
      nftMetadataUrl,
      { gasLimit: 3000000, }
    );
    const receipt = await tx.wait();
    console.log(receipt);
  }
}
