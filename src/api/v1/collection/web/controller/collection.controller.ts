import { Body, Controller, Get, Post } from '@nestjs/common';
import CollectionService from '../../core/service/collection.service';
import Collection from '../../core/entity/collection.entity';
import CollectionCreateDto from '../dto/collection_create.dto';
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

    @Post()
    create(@Body() collectionCreateDto: CollectionCreateDto): Promise<CollectionCreateDto> {
        return this.collectionService.create(collectionCreateDto);
    }
}
