import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Comics from './core/entity/comics.entity';
import ComicsService from './core/service/comics.service';
import ComicsController from './web/controller/comics.controller';
import ComicsPagesService from './core/service/comics-pages.service';
import AWSConnectorS3 from '../comics-image/core/connector/aws-s3.connector';

@Module({
    imports: [TypeOrmModule.forFeature([Comics])],
    controllers: [ComicsController],
    providers: [ComicsService, ComicsPagesService, AWSConnectorS3],
})
export default class ComicsModule {}
