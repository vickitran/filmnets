import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import * as nodePath from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/create-asset')
  async createAsset(@Body() body) {
    console.log('start');
    const base64Data = body.data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    const convertedFilePath = await this.appService.convertVideo(base64Data);
    const tokenURI = await this.appService.createAssetLivePeer(
      convertedFilePath,
    );
    await this.appService.mintNFTLivePeer(tokenURI);
    return tokenURI;
  }
}
