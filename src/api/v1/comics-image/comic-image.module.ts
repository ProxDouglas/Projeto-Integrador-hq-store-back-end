import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ComicsImageController from './web/controller/comic-image.controller';
import ComicsImageService from './core/service/comic-image.service';
import ComicsImage from './core/entity/comic-image.entity';
import Comics from '../comics/core/entity/comics.entity';
import AWSConnectorS3 from './core/connector/aws-s3.connector';

@Module({
    imports: [TypeOrmModule.forFeature([ComicsImage, Comics])],
    controllers: [ComicsImageController],
    providers: [ComicsImageService, AWSConnectorS3],
})
export default class ComicsImageModule {}
