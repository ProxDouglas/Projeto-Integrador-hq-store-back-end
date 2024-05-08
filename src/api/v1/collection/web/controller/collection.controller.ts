import { Controller, Get, Post } from '@nestjs/common';
import CollectionService from '../../core/service/collection.service';
import Collection from '../../core/entity/collection.entity';
import CollectionDto from '../dto/collection.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('collections')
@Controller('api/collections')
export default class CollectionController {
    private readonly collectionService: CollectionService;

    constructor(collectionService: CollectionService) {
        this.collectionService = collectionService;
    }

    @Get()
    list(): Promise<Collection[]> {
        return this.collectionService.list();
    }

    // @Post()
    // create(): Promise<CollectionDto>{
        
    // }
}
