import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '150mb' }));
  app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('film net api')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('filmnet')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
