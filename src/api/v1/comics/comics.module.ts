import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Comics from './core/entity/comics.entity';
import ComicsService from './core/service/comics.service';
import ComicsController from './web/controller/comics.controller';
import FilterFactory from './core/filter/filter-factory';
import SearchPages from './core/serch/search-pages';
import ComicsImageModule from '../comics-image/comic-image.module';

@Module({
    imports: [TypeOrmModule.forFeature([Comics]), ComicsImageModule],
    controllers: [ComicsController],
    providers: [ComicsService, FilterFactory, SearchPages],
})
export default class ComicsModule {}
