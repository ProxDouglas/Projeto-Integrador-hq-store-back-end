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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('comics')
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

    @Get('pages/take/:take/skip/:skip/')
    listPages(
        @Param('take', ParseIntPipe)
        take: number,
        @Param('skip', ParseIntPipe)
        skip: number,
        @Query('', ComicsPagesQueryValidationPipe)
        comicsPagesQueryDto: ComicsPagesQueryDto,
    ): Promise<ComicsPagesDto> {
        comicsPagesQueryDto.take = take;
        comicsPagesQueryDto.skip = skip;
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
    @ApiOperation({ summary: 'Adicionar uma nova hq.' })
    @ApiResponse({
        status: 201,
        description: 'Nova hq adicionada.',
        type: ComicsDto,
    })
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
