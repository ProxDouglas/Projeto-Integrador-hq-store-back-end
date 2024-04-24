import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    HttpStatus,
} from '@nestjs/common';
import ComicBookService from '../../core/service/comic-book.service';
import ComicBookDto from '../dto/comic-book.dto';

@Controller('api/comics')
export default class ComicBookController {
    private readonly comicBookService: ComicBookService;

    constructor(comicBookService: ComicBookService) {
        this.comicBookService = comicBookService;
    }

    @Get()
    list(): Promise<ComicBookDto[]> {
        return this.comicBookService.list();
    }

    @Get(':id')
    getById(
        @Param('id', ParseIntPipe)
        id: number,
    ): Promise<ComicBookDto> {
        return this.comicBookService.getById(id);
    }

    @Post()
    create(@Body() comicBookDto: ComicBookDto): Promise<ComicBookDto> {
        return this.comicBookService.create(comicBookDto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe)
        id: number,
        @Body() comicBookDto: ComicBookDto,
    ): Promise<ComicBookDto> {
        return this.comicBookService.update(id, comicBookDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<ComicBookDto> {
        return this.comicBookService.getById(id);
    }
}
