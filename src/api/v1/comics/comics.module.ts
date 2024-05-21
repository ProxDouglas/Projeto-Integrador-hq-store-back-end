import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Comics from './core/entity/comics.entity';
import ComicsService from './core/service/comics.service';
import ComicsController from './web/controller/comics.controller';
import ComicsPagesService from './core/service/comics-pages.service';

@Module({
    imports: [TypeOrmModule.forFeature([Comics])],
    controllers: [ComicsController],
    providers: [ComicsService, ComicsPagesService],
})
export default class ComicsModule {}
