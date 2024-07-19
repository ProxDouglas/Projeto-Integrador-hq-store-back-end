import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    Min,
    Max,
    Length,
    IsNotEmpty,
    IsNumber,
    IsPositive,
} from 'class-validator';

export default class CarrinhoItemDto {
    @ApiProperty()
    carrinho_id: number;

    @ApiProperty()
    hq_id: number;

    @ApiProperty()
    quantidade: number;
}
