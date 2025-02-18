import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  ApiResponseDto,
  ErrorResponseDto,
  PagingResponseDto,
  SuccessResponseDto,
} from './common/dto/api-response.dto';
import { useContainer } from 'class-validator';
import { AllExceptionFilter } from './common/exception/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionFilter());
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Moca Point Of Sale Api')
    .setDescription('Documentation for Moca Point Of Sale')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      extraModels: [
        SuccessResponseDto,
        ErrorResponseDto,
        ApiResponseDto,
        PagingResponseDto,
      ],
    });
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
