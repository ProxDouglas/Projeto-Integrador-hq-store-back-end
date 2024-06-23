import {
    Body,
    Controller,
    Delete,
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
import ResponseStatusSave from 'src/api/v1/response-status/response-status-save';
import ComicsAssociateDto from 'src/api/v1/comics/web/dto/comics-associate.dto';
import ResponseStatusDefault from 'src/api/v1/response-status/response-status-default';

@ApiTags('collections')
@Controller('api/collections')
export default class CollectionController {
    private readonly collectionService: CollectionService;

    constructor(collectionService: CollectionService) {
        this.collectionService = collectionService;
    }

    @Get('comics/:name')
    getByComicsName(@Param('name') name: string): Promise<Collection[]> {
        return this.collectionService.getByComicsName(name);
    }

    @Get(':id')
    getById(
        @Param('id', ParseIntPipe)
        id: number,
    ): Promise<Collection> {
        return this.collectionService.getById(id);
    }

    @Post()
    create(
        @Body() collectionCreateDto: CollectionCreateDto,
    ): Promise<CollectionCreateDto> {
        return this.collectionService.create(collectionCreateDto);
    }

    @Post(':id/comics')
    async addComics(
        @Param('id', ParseIntPipe)
        id: number,
        @Body() comics: ComicsAssociateDto[],
    ): Promise<ResponseStatus> {
        await this.collectionService.addComics(id, comics);
        return new ResponseStatusSave();
    }

    @Delete(':id/comics/:comics_id')
    async removeComics(
        @Param('id', ParseIntPipe)
        id: number,
        @Param('id', ParseIntPipe)
        comics_id: number,
    ): Promise<ResponseStatus> {
        await this.collectionService.removeComics(id, comics_id);
        return new ResponseStatusDefault();
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<ResponseStatus> {
        return this.collectionService
            .delete(id)
            .then(() => new ResponseStatusDefault());
    }
}
