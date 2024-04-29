import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import ComicsService from '../../core/service/comics.service';
import ComicsDto from '../dto/comics.dto';
import Comics from '../../core/entity/comics.entity';
import ComicsPagesDto from '../dto/comics-pages.dto';
import ComicsPagesQueryDto from '../dto/comics-pages-query.dto';
import { ComicsPagesQueryValidationPipe } from '../Pipe/comics-pages-query-pipe';

@Controller('api/comics')
export default class ComicsController {
    private readonly comicsService: ComicsService;

    constructor(comicsService: ComicsService) {
        this.comicsService = comicsService;
    }

    @Get()
    list(): Promise<Comics[]> {
        return this.comicsService.list();
    }

    @Get('pages')
    listPages(
        @Query('', ComicsPagesQueryValidationPipe)
        comicsPagesQueryDto: ComicsPagesQueryDto,
    ): Promise<ComicsPagesDto> {
        return this.comicsService.listPages(comicsPagesQueryDto);
    }

    @Get(':id')
    async getById(
        @Param('id', ParseIntPipe)
        id: number,
    ): Promise<Comics> {
        return await this.comicsService.getById(id);
    }

    @Post()
    create(@Body() comicsDto: ComicsDto): Promise<ComicsDto> {
        return this.comicsService.create(comicsDto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe)
        id: number,
        @Body() comicsDto: ComicsDto,
    ): Promise<ComicsDto> {
        return this.comicsService.update(id, comicsDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<Comics> {
        return this.comicsService.getById(id);
    }
}
