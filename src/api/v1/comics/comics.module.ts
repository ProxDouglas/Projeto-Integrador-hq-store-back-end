import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Comics from './core/entity/comics.entity';
import ComicsService from './core/service/comics.service';
import ComicsController from './web/controller/comics.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Comics])],
    controllers: [ComicsController],
    providers: [ComicsService],
})
export default class ComicsModule {}
