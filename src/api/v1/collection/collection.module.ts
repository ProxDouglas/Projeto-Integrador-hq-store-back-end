import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Collection from './core/entity/collection.entity';
import CollectionController from './web/controller/collection.controller';
import CollectionService from './core/service/collection.service';
import CollectionCreateMapper from './web/mapper/collection_create.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([Collection])],
    controllers: [CollectionController],
    providers: [CollectionService, CollectionCreateMapper],
})
export default class CollectionModule {}
