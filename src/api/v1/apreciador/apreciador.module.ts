import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Apreciador from './core/entity/apreciador.entity';
import ApreciadorService from './core/service/apreciador.service';
import ApreciadorController from './web/controller/apreciador.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Apreciador])],
    controllers: [ApreciadorController],
    providers: [ApreciadorService],
})
export default class ApreciadorModule {}
