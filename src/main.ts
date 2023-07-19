import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ETLWorker } from './etl.worker';
import { setupStaticMethods } from './setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupStaticMethods(app);
  app.connectMicroservice<MicroserviceOptions>(
    {
      strategy: new ETLWorker(),
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
