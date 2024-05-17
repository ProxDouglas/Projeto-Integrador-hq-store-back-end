import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Autor from './core/entity/autor.entity';
import AutorService from './core/service/autor.service';
import AutorController from './web/controller/autor.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Autor])],
    controllers: [AutorController],
    providers: [AutorService],
})
export default class AutorModule {}
