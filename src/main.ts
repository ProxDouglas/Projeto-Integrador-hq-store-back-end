import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    // const config = new DocumentBuilder()
    //     .setTitle('Comics')
    //     .setDescription('The comics API description')
    //     .setVersion('1.0')
    //     .addTag('comics')
    //     .build();
    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT || 8080);
}
bootstrap();
