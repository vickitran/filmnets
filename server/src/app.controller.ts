import { Controller, Get, Post, UseInterceptors, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/create-asset')
  @UseInterceptors(FileInterceptor('video'))
  async createAsset(@Body() body) {
    const dataBody = body.video;
    const videoJson = JSON.parse(dataBody);
    const { uri } = videoJson;
    // TODO: trick part to read data from ios simulator
    const videoPath = uri.replace('file://', '');
    console.log(`path: ${videoPath}`);
    const tokenURI = await this.appService.createAsset(videoPath, 'testName');
    return tokenURI;
  }
}
