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
import ApreciadorService from '../../core/service/apreciador.service';
import ApreciadorDto from '../dto/apreciador.dto';
import Apreciador from '../../core/entity/apreciador.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('apreciador')
@Controller('api/apreciador')
export default class ApreciadorController {
    private readonly apreciadorService: ApreciadorService;

    constructor(apreciadorService: ApreciadorService) {
        this.apreciadorService = apreciadorService;
    }

    @Get()
    list(): Promise<Apreciador[]> {
        return this.apreciadorService.list();
    }

    @Get(':id')
    async getById(
        @Param('id', ParseIntPipe)
        id: number,
    ): Promise<Apreciador> {
        return await this.apreciadorService.getById(id);
    }

    @Post()
    create(@Body() apreciadorDto: ApreciadorDto): Promise<ApreciadorDto> {
        return this.apreciadorService.create(apreciadorDto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe)
        id: number,
        @Body() apreciadorDto: ApreciadorDto,
    ): Promise<ApreciadorDto> {
        return this.apreciadorService.update(id, apreciadorDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<Apreciador> {
        return this.apreciadorService.getById(id);
    }
}
