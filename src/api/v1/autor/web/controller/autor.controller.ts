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
import AutorService from '../../core/service/autor.service';
import AutorDto from '../dto/autor.dto';
import Autor from '../../core/entity/autor.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('autor')
@Controller('api/autor')
export default class AutorController {
    private readonly autorService: AutorService;

    constructor(autorService: AutorService) {
        this.autorService = autorService;
    }

    @Get()
    list(): Promise<Autor[]> {
        return this.autorService.list();
    }

    @Get(':id')
    async getById(
        @Param('id', ParseIntPipe)
        id: number,
    ): Promise<Autor> {
        return await this.autorService.getById(id);
    }

    @Post()
    create(@Body() autorDto: AutorDto): Promise<AutorDto> {
        return this.autorService.create(autorDto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe)
        id: number,
        @Body() autorDto: AutorDto,
    ): Promise<AutorDto> {
        return this.autorService.update(id, autorDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<Autor> {
        return this.autorService.getById(id);
    }
}
