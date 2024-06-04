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
import CarrinhoService from '../../core/service/carrinho.service';
import CarrinhoDto from '../dto/carrinho.dto';
import Carrinho from '../../core/entity/carrinho.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('carrinho')
@Controller('api/carrinho')
export default class CarrinhoController {
    private readonly carrinhoService: CarrinhoService;

    constructor(carrinhoService: CarrinhoService) {
        this.carrinhoService = carrinhoService;
    }

    @Get(':apreciador_id')
    list(
        @Param('apreciador_id', ParseIntPipe)
        apreciador_id: number,
    ): Promise<Carrinho[]> {
        return this.carrinhoService.list(apreciador_id);
    }

    // @Post()
    // create(@Body() carrinhoDto: CarrinhoDto): Promise<CarrinhoDto> {
    //     return this.carrinhoService.create(carrinhoDto);
    // }

    // @Delete(':id')
    // delete(@Param('id', ParseIntPipe) id: number): Promise<Carrinho> {
    //     return this.carrinhoService.getById(id);
    // }
}
