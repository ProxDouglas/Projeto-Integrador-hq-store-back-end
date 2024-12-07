import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import ComicsService from '../../core/service/comics.service';
import Comics from '../../core/entity/comics.entity';
import ComicsPagesDto from '../dto/comics-pages.dto';
import ComicsPagesQueryDto from '../dto/comics-pages-query.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateComicsDto from '../dto/create-comics.dto';

@ApiTags('comics')
@Controller('api/comics')
export default class ComicsController {
    private readonly comicsService: ComicsService;

    constructor(comicsService: ComicsService) {
        this.comicsService = comicsService;
    }

    @Post('pages/take/:take/skip/:skip/')
    listPages(
        @Param('take', ParseIntPipe)
        take: number,
        @Param('skip', ParseIntPipe)
        skip: number,
        // @Query('', ComicsPagesQueryValidationPipe)
        // comicsPagesQueryDto: ComicsPagesQueryDto,
        @Body() comicsPagesQueryDtoList: ComicsPagesQueryDto[],
    ): Promise<ComicsPagesDto> {
        return this.comicsService.listPages(
            take,
            skip,
            comicsPagesQueryDtoList,
        );
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
        type: CreateComicsDto,
    })
    create(@Body() createComicsDto: CreateComicsDto): Promise<CreateComicsDto> {
        return this.comicsService.create(createComicsDto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe)
        id: number,
        @Body() createComicsDto: CreateComicsDto,
    ): Promise<CreateComicsDto> {
        return this.comicsService.update(id, createComicsDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<Comics> {
        return this.comicsService.getById(id);
    }
}
