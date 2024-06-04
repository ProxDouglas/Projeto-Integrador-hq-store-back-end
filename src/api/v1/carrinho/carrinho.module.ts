import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Collection from './core/entity/carrinho.entity';
import CollectionController from './web/controller/carrinho.controller';
import CollectionService from './core/service/carrinho.service';
import Comics from '../comics/core/entity/comics.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Collection, Comics])],
    controllers: [CollectionController],
})
export default class CollectionModule {}
