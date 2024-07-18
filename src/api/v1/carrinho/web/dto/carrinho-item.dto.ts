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
    @Length(1, 15)
    @IsInt()
    @IsNotEmpty()
    carrinho_id: number;

    @ApiProperty()
    @Length(1, 15)
    @IsInt()
    @IsNotEmpty()
    hq_id: number;

    @ApiProperty()
    @Length(1, 15)
    @IsInt()
    @IsNotEmpty()
    quantidade: number;
}
