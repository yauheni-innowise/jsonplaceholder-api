import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  app.setGlobalPrefix('api');
  
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('JSONPlaceholder API')
    .setDescription('RESTful API based on the JSONPlaceholder data')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('auth', 'Authentication endpoints')
    .addTag('health', 'Health check endpoints')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
