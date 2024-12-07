import { ApiProperty } from '@nestjs/swagger';
import CarrinhoItem from '../../core/entity/carrinho-item.entity';

export default class CarrinhoDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    apreciador_id: number;

    @ApiProperty()
    itemCarrinho: CarrinhoItem[];

    /*
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
    */
}
