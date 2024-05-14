import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import CollectionService from '../../core/service/collection.service';
import Collection from '../../core/entity/collection.entity';
import CollectionCreateDto from '../dto/collection_create.dto';
import { ApiTags } from '@nestjs/swagger';
import ResponseStatus from 'src/api/v1/response-status/response-status.interface';
import Comics from 'src/api/v1/comics/core/entity/comics.entity';
import ResponseStatusSave from 'src/api/v1/response-status/response-status-save';
import ComicsAssociateDto from 'src/api/v1/comics/web/dto/comics-associate.dto';

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
    create(
        @Body() collectionCreateDto: CollectionCreateDto,
    ): Promise<CollectionCreateDto> {
        return this.collectionService.create(collectionCreateDto);
    }

    @Post('comics/:id')
    addComics(
        @Param('id', ParseIntPipe)
        id: number,
        @Body() comics: ComicsAssociateDto[],
    ): Promise<ResponseStatus> {
        return this.collectionService
            .addComics(id, comics)
            .then(() => new ResponseStatusSave());
    }
}
