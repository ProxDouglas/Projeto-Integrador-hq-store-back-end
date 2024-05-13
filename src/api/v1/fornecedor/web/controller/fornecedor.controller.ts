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
import FornecedorService from '../../core/service/fornecedor.service';
import FornecedorDto from '../dto/fornecedor.dto';
import Fornecedor from '../../core/entity/fornecedor.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('fornecedor')
@Controller('api/fornecedor')
export default class FornecedorController {
    private readonly fornecedorService: FornecedorService;

    constructor(fornecedorService: FornecedorService) {
        this.fornecedorService = fornecedorService;
    }

    @Get()
    list(): Promise<Fornecedor[]> {
        return this.fornecedorService.list();
    }

    @Get(':id')
    async getById(
        @Param('id', ParseIntPipe)
        id: number,
    ): Promise<Fornecedor> {
        return await this.fornecedorService.getById(id);
    }

    @Post()
    create(@Body() fornecedorDto: FornecedorDto): Promise<FornecedorDto> {
        return this.fornecedorService.create(fornecedorDto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe)
        id: number,
        @Body() fornecedorDto: FornecedorDto,
    ): Promise<FornecedorDto> {
        return this.fornecedorService.update(id, fornecedorDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<Fornecedor> {
        return this.fornecedorService.getById(id);
    }
}
