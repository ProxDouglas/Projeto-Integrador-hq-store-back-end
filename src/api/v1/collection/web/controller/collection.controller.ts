import { Controller, Get } from '@nestjs/common';
import CollectionService from '../../core/service/collection.service';
import Collection from '../../core/entity/collection.entity';

@Controller('api/collection')
export default class CollectionController {
    private readonly collectionService: CollectionService;

    constructor(collectionService: CollectionService) {
        this.collectionService = collectionService;
    }

    @Get()
    list(): Promise<Collection[]> {
        return this.collectionService.list();
    }
}
